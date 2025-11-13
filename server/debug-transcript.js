import { getSubtitles } from "youtube-captions-scraper";

// Test with a video that has captions
const testVideoId = "jNQXAC9IVRw"; // Me at the zoo (first YouTube video)

console.log("Testing YouTube transcript fetching with youtube-captions-scraper...");

const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const fetchTranscript = async (videoId) => {
  console.log(`Attempting to fetch transcript for video ID: ${videoId}`);
  
  // Method 1: Try with 'en' language code
  try {
    console.log("Trying method 1: en language code");
    const transcript = await getSubtitles({
      videoID: videoId,
      lang: 'en'
    });
    if (transcript.length > 0) {
      console.log(`Method 1 successful: ${transcript.length} segments`);
      return transcript;
    }
  } catch (error) {
    console.log("Method 1 failed:", error.message);
  }
  
  // Method 2: Try with 'auto' language code
  try {
    console.log("Trying method 2: auto language code");
    const transcript = await getSubtitles({
      videoID: videoId,
      lang: 'auto'
    });
    if (transcript.length > 0) {
      console.log(`Method 2 successful: ${transcript.length} segments`);
      return transcript;
    }
  } catch (error) {
    console.log("Method 2 failed:", error.message);
  }
  
  // Method 3: Try with various English language codes
  const langCodes = ['en-US', 'en-GB', 'en-CA', 'en-AU'];
  for (const lang of langCodes) {
    try {
      console.log(`Trying method 3: ${lang} language code`);
      const transcript = await getSubtitles({
        videoID: videoId,
        lang: lang
      });
      if (transcript.length > 0) {
        console.log(`Method 3 (${lang}) successful: ${transcript.length} segments`);
        return transcript;
      }
    } catch (error) {
      console.log(`Method 3 (${lang}) failed:`, error.message);
    }
  }
  
  // If all methods fail, return empty array
  console.log("All methods failed to fetch transcript");
  return [];
};

try {
  console.log("Attempting to fetch captions for video ID:", testVideoId);
  fetchTranscript(testVideoId).then(transcript => {
    console.log("Transcript fetched successfully:");
    console.log(`Number of segments: ${transcript.length}`);
    if (transcript.length > 0) {
      console.log("First few segments:", transcript.slice(0, 3));
    }
  });
} catch (error) {
  console.error("Error fetching transcript:", error.message);
  console.error("Error stack:", error.stack);
}