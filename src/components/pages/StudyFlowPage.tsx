import { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Upload, RefreshCw, Save } from 'lucide-react';
import { Textarea } from '../ui/textarea';

interface TranscriptSegment {
  timeRange: string;
  description: string;
  timestamp: number;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function StudyFlowPage() {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastPosition, setLastPosition] = useState<number>(0);
  const [quickNotes, setQuickNotes] = useState('');
  const [notesTitle, setNotesTitle] = useState('');
  const [isNotesSaved, setIsNotesSaved] = useState(false);
  const playerRef = useRef<any>(null);
  const playerInitialized = useRef(false);

  // Load YouTube link and video position from localStorage on component mount
  useEffect(() => {
    const savedLink = localStorage.getItem('youtubeLink');
    const savedIsAnalyzed = localStorage.getItem('isAnalyzed') === 'true';
    const savedVideoId = localStorage.getItem('videoId');
    const savedPosition = localStorage.getItem('videoPosition');
    const savedNotes = localStorage.getItem('studyFlowQuickNotes');
    const savedNotesTitle = localStorage.getItem('studyFlowNotesTitle');
    
    if (savedLink) {
      setYoutubeLink(savedLink);
    }
    
    if (savedPosition) {
      setLastPosition(parseFloat(savedPosition));
    }
    
    if (savedNotes) {
      setQuickNotes(savedNotes);
    }
    
    if (savedNotesTitle) {
      setNotesTitle(savedNotesTitle);
    }
    
    if (savedIsAnalyzed && savedVideoId) {
      setIsAnalyzed(savedIsAnalyzed);
      setVideoId(savedVideoId);
    }
  }, []);

  // Save YouTube link to localStorage whenever it changes
  useEffect(() => {
    if (youtubeLink) {
      localStorage.setItem('youtubeLink', youtubeLink);
    }
  }, [youtubeLink]);

  // Save analysis state to localStorage
  useEffect(() => {
    localStorage.setItem('isAnalyzed', isAnalyzed.toString());
    if (videoId) {
      localStorage.setItem('videoId', videoId);
    }
  }, [isAnalyzed, videoId]);

  // Save video position to localStorage
  useEffect(() => {
    if (lastPosition > 0) {
      localStorage.setItem('videoPosition', lastPosition.toString());
    }
  }, [lastPosition]);

  // Save quick notes to localStorage
  useEffect(() => {
    if (quickNotes) {
      localStorage.setItem('studyFlowQuickNotes', quickNotes);
    }
    if (notesTitle) {
      localStorage.setItem('studyFlowNotesTitle', notesTitle);
    }
  }, [quickNotes, notesTitle]);

  // Initialize YouTube Player API
  useEffect(() => {
    if (!isAnalyzed || !videoId) return;

    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [isAnalyzed, videoId]);

  // Set up player state tracking
  useEffect(() => {
    if (!playerRef.current) return;

    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          setLastPosition(currentTime);
        } catch (e) {
          console.log('Player not ready yet');
        }
      }
    }, 1000); // Update position every second

    return () => clearInterval(interval);
  }, [playerRef.current]);

  const initializePlayer = () => {
    if (playerInitialized.current) return;
    
    playerInitialized.current = true;
    
    playerRef.current = new window.YT.Player('youtube-player', {
      videoId: videoId,
      playerVars: {
        'start': Math.floor(lastPosition),
        'enablejsapi': 1,
        'controls': 1,
        'modestbranding': 1,
        'rel': 0
      },
      events: {
        'onReady': (event: any) => {
          console.log('Player is ready');
          // Seek to last position if it exists
          if (lastPosition > 0) {
            event.target.seekTo(lastPosition, true);
          }
        },
        'onStateChange': (event: any) => {
          console.log('Player state changed:', event.data);
        }
      }
    });
  };

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  // Handle video analysis
  const handleAnalyze = async () => {
    if (!youtubeLink.trim()) {
      setError('Please enter a YouTube link');
      return;
    }

    const id = extractVideoId(youtubeLink);
    if (!id) {
      setError('Invalid YouTube link');
      return;
    }

    setLoading(true);
    setError('');
    setVideoId(id);
    setIsAnalyzed(true);
    setLoading(false);
  };

  // Handle clear button - resets all state and localStorage
  const handleClear = () => {
    setYoutubeLink('');
    setIsAnalyzed(false);
    setVideoId('');
    setError('');
    setLastPosition(0);
    setQuickNotes('');
    setNotesTitle('');
    
    // Clear localStorage
    localStorage.removeItem('youtubeLink');
    localStorage.removeItem('isAnalyzed');
    localStorage.removeItem('videoId');
    localStorage.removeItem('videoPosition');
    localStorage.removeItem('studyFlowQuickNotes');
    localStorage.removeItem('studyFlowNotesTitle');
    
    // Destroy player if it exists
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
      playerInitialized.current = false;
    }
  };

  // Handle save notes button
  const handleSaveNotes = () => {
    if (!quickNotes.trim()) return;
    
    // Save to localStorage with timestamp
    const note = {
      id: Date.now().toString(),
      title: notesTitle || `Study Flow Note ${new Date().toLocaleString()}`,
      content: quickNotes,
      timestamp: new Date().toLocaleString(),
      videoId: videoId,
      videoLink: youtubeLink,
      source: 'study-flow' as const
    };
    
    // Get existing notes
    const existingNotes = localStorage.getItem('quickNotes');
    let notesArray = existingNotes ? JSON.parse(existingNotes) : [];
    
    // Add new note
    notesArray.unshift(note);
    
    // Save back to localStorage
    localStorage.setItem('quickNotes', JSON.stringify(notesArray));
    
    // Show saved feedback
    setIsNotesSaved(true);
    setTimeout(() => setIsNotesSaved(false), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Paste YouTube Link (e.g., https://youtube.com/watch?v=...)"
                value={youtubeLink}
                onChange={(e) => {
                  setYoutubeLink(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                className="flex-1 h-12 px-5 rounded-2xl border-2 border-slate-200 focus:border-teal-500 transition-colors text-slate-700 bg-slate-50"
              />
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="h-12 px-8 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Load Video
                  </>
                )}
              </Button>
              <Button
                onClick={handleClear}
                disabled={loading}
                className="h-12 px-8 rounded-2xl bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>

        {/* Main Content - Split View */}
        {isAnalyzed && (
          <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
            {/* Left Side - Video Player */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/50">
                <div className="relative bg-black aspect-video rounded-2xl overflow-hidden">
                  {videoId && (
                    <div id="youtube-player" className="w-full h-full"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Quick Notes (Replaces Transcript Panel) */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/50">
              <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-teal-50 to-blue-50">
                <h3 className="text-slate-800">Quick Notes</h3>
              </div>
              
              <div className="p-6 h-full flex flex-col">
                <div className="mb-6">
                  <label htmlFor="notes-title" className="block text-sm font-medium text-slate-700 mb-2">
                    Note Title (Optional)
                  </label>
                  <Input
                    type="text"
                    id="notes-title"
                    value={notesTitle}
                    onChange={(e) => setNotesTitle(e.target.value)}
                    placeholder="Enter a title for your notes"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
                
                <div className="flex-1 flex flex-col mb-6">
                  <label htmlFor="quick-notes" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Notes
                  </label>
                  <Textarea
                    id="quick-notes"
                    value={quickNotes}
                    onChange={(e) => setQuickNotes(e.target.value)}
                    placeholder="Take notes while watching the video..."
                    className="flex-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors resize-none"
                  />
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleSaveNotes}
                    disabled={!quickNotes.trim()}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isNotesSaved ? 'Saved!' : 'Save to Utilities'}
                  </Button>
                </div>
                
                <div className="text-sm text-slate-500 mt-4">
                  <p>Notes will be saved to the Utilities page where you can access them later.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Empty State with Instructions */}
        {!isAnalyzed && (
          <div className="bg-white rounded-3xl shadow-lg p-12 border border-slate-200/50">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-12 h-12 text-teal-600" />
              </div>
              
              <div>
                <h2 className="text-slate-800 mb-3">Get Started with Study Flow</h2>
                <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  Paste any YouTube educational video link above to load the video player. 
                  Take quick notes while watching and save them to your Utilities page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200/50">
                  <div className="w-12 h-12 mx-auto bg-teal-500 rounded-xl flex items-center justify-center text-white text-xl mb-3">
                    1
                  </div>
                  <h4 className="text-sm text-slate-800 mb-2">Paste Link</h4>
                  <p className="text-xs text-slate-600">
                    Copy any YouTube video URL and paste it in the input field above
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50">
                  <div className="w-12 h-12 mx-auto bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl mb-3">
                    2
                  </div>
                  <h4 className="text-sm text-slate-800 mb-2">Watch & Take Notes</h4>
                  <p className="text-xs text-slate-600">
                    Watch the video and take notes in the sidebar
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/50">
                  <div className="w-12 h-12 mx-auto bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl mb-3">
                    3
                  </div>
                  <h4 className="text-sm text-slate-800 mb-2">Save to Utilities</h4>
                  <p className="text-xs text-slate-600">
                    Save your notes to access them anytime in the Utilities page
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}