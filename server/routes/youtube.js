import express from "express";
import { getSubtitles } from "youtube-captions-scraper";
import { YoutubeTranscript } from 'youtube-transcript';

const router = express.Router();

// Function to extract video ID from various YouTube URL formats
const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Function to group transcript segments into chunks
const groupTranscriptSegments = (segments, maxTokens = 1500) => {
  const chunks = [];
  let currentChunk = [];
  let currentTokenCount = 0;
  
  for (const segment of segments) {
    // Estimate token count (roughly 4 characters per token)
    const segmentTokenCount = Math.ceil(segment.text?.length || segment.content?.length || 0 / 4);
    
    // If adding this segment would exceed the token limit, start a new chunk
    if (currentTokenCount + segmentTokenCount > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = [segment];
      currentTokenCount = segmentTokenCount;
    } else {
      currentChunk.push(segment);
      currentTokenCount += segmentTokenCount;
    }
  }
  
  // Don't forget the last chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
};

// Function to summarize a chunk of transcript
const summarizeChunk = async (chunk, openai) => {
  // If OpenAI is not available, return basic summary
  if (!openai) {
    const text = chunk.map(s => s.text || s.content || '').join(' ');
    const startTime = chunk[0].start || chunk[0].offset || 0;
    const endTime = chunk[chunk.length - 1].start + chunk[chunk.length - 1].dur || 
                   chunk[chunk.length - 1].offset || startTime + 10;
    
    return {
      timeRange: `${formatTime(startTime)}–${formatTime(endTime)}`,
      description: text,
      timestamp: startTime
    };
  }
  
  try {
    const transcriptText = chunk.map(s => s.text || s.content || '').join(' ');
    const startTime = chunk[0].start || chunk[0].offset || 0;
    const endTime = chunk[chunk.length - 1].start + chunk[chunk.length - 1].dur || 
                   chunk[chunk.length - 1].offset || startTime + 10;
    
    // Limit the text to avoid token limits
    const limitedText = transcriptText.substring(0, 3000);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at summarizing educational video content. Create a concise, informative summary that captures the key points and concepts discussed in this segment. Keep it under 20 words."
        },
        {
          role: "user",
          content: `Summarize this part of a video transcript:\n\n${limitedText}`
        }
      ],
      max_tokens: 100,
      temperature: 0.5
    });
    
    return {
      timeRange: `${formatTime(startTime)}–${formatTime(endTime)}`,
      description: completion.choices[0].message.content.trim(),
      timestamp: startTime
    };
  } catch (error) {
    console.error("Error summarizing chunk:", error);
    // Fallback to basic summary if AI fails
    const text = chunk.map(s => s.text || s.content || '').join(' ');
    const startTime = chunk[0].start || chunk[0].offset || 0;
    const endTime = chunk[chunk.length - 1].start + chunk[chunk.length - 1].dur || 
                   chunk[chunk.length - 1].offset || startTime + 10;
    
    return {
      timeRange: `${formatTime(startTime)}–${formatTime(endTime)}`,
      description: text,
      timestamp: startTime
    };
  }
};

// Helper function to format seconds to MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

router.post("/analyze-youtube", async (req, res) => {
  try {
    const { youtubeUrl } = req.body;
    const openai = req.openai; // Get openai instance from request

    // Extract video ID
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) return res.status(400).json({ error: "Invalid YouTube URL" });

    // Try multiple methods to fetch subtitles
    let subtitles = [];
    let errorMessages = [];
    
    // Method 1: Try youtube-transcript library
    try {
      console.log("Trying youtube-transcript library...");
      subtitles = await YoutubeTranscript.fetchTranscript(videoId);
      console.log("youtube-transcript success, got", subtitles.length, "segments");
    } catch (error) {
      console.error("youtube-transcript failed:", error.message);
      errorMessages.push(`youtube-transcript: ${error.message}`);
      
      // Method 2: Try youtube-captions-scraper
      try {
        console.log("Trying youtube-captions-scraper...");
        subtitles = await getSubtitles({
          videoID: videoId,
          lang: 'en'
        });
        console.log("youtube-captions-scraper success, got", subtitles.length, "segments");
      } catch (error2) {
        console.error("youtube-captions-scraper failed:", error2.message);
        errorMessages.push(`youtube-captions-scraper: ${error2.message}`);
        
        // Method 3: Try with any language
        try {
          console.log("Trying youtube-captions-scraper with auto language...");
          subtitles = await getSubtitles({
            videoID: videoId,
            lang: 'en'
          });
          console.log("youtube-captions-scraper (auto) success, got", subtitles.length, "segments");
        } catch (error3) {
          console.error("All methods failed:", error3.message);
          errorMessages.push(`auto-detect: ${error3.message}`);
        }
      }
    }

    if (!subtitles || subtitles.length === 0) {
      return res.status(404).json({ 
        error: "No subtitles found for this video. The video might not have captions enabled or available.",
        details: errorMessages.join('; ')
      });
    }

    // Transform subtitles to consistent format
    const formattedSubtitles = subtitles.map(segment => ({
      start: segment.start || segment.offset || 0,
      dur: segment.dur || segment.duration || 5,
      text: segment.text || segment.content || '',
      offset: segment.offset,
      duration: segment.duration
    }));

    // Group subtitles into chunks
    const chunks = groupTranscriptSegments(formattedSubtitles);
    
    // Summarize each chunk
    const summarizedChunks = [];
    for (const chunk of chunks) {
      const summary = await summarizeChunk(chunk, openai);
      summarizedChunks.push(summary);
    }

    return res.json({ 
      transcript: summarizedChunks,
      summary: "Video transcript successfully analyzed"
    });
  } catch (error) {
    console.error("Error in analyze-youtube:", error);
    return res.status(500).json({ 
      error: "Failed to analyze YouTube video",
      details: error.message
    });
  }
});

export default router;