import { YoutubeTranscript } from "youtube-transcript";

// Test with a video that has captions
const testVideoId = "jNQXAC9IVRw"; // This is the first YouTube video

try {
  const transcript = await YoutubeTranscript.fetchTranscript(testVideoId);
  console.log("Transcript fetched successfully:");
  console.log(`Number of segments: ${transcript.length}`);
  console.log("First few segments:", transcript.slice(0, 3));
} catch (error) {
  console.error("Error fetching transcript:", error);
}