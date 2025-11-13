import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Calendar, 
  Target, 
  Brain, 
  Feather, 
  Bell,
  Zap,
  Trophy,
  Clock,
  BookOpen,
  Lightbulb,
  Volume2,
  VolumeX,
  Plus,
  CheckCircle,
  Circle,
  BookOpenCheck,
  ChevronRight,
  ChevronDown,
  FileText,
  Youtube
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  order: number;
  watched: boolean;
  notes: string;
  summary: string;
}

interface Journey {
  id: string;
  title: string;
  playlistUrl: string;
  totalVideos: number;
  totalDays: number;
  startDate: string;
  endDate: string;
  videos: Video[];
  currentVideoIndex: number;
  focusScore: number;
  streak: number;
  lastPlayedDate: string | null;
  progress: number;
}

export function SmartJourneyPage() {
  // State for different sections of the page
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [journey, setJourney] = useState<Journey | null>(null);
  const [journeyTitle, setJourneyTitle] = useState('');
  const [totalDays, setTotalDays] = useState(7);
  const [isPlaying, setIsPlaying] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [notes, setNotes] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [dailySchedule, setDailySchedule] = useState<{day: number; videos: Video[]}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [expandedDays, setExpandedDays] = useState<number[]>([1]); // Track expanded days in schedule
  
  const playerRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  const mockVideos: Video[] = [
    {
      id: 'dGcsHMXfRto',
      title: 'Introduction to React Hooks',
      thumbnail: 'https://i.ytimg.com/vi/dGcsHMXfRto/hqdefault.jpg',
      duration: '15:30',
      order: 1,
      watched: true,
      notes: 'useState and useEffect are the most important hooks to understand',
      summary: 'React Hooks allow you to use state and other React features without writing a class component.'
    },
    {
      id: '1gZAqJA2pEk',
      title: 'Advanced React Patterns',
      thumbnail: 'https://i.ytimg.com/vi/1gZAqJA2pEk/hqdefault.jpg',
      duration: '22:15',
      order: 2,
      watched: false,
      notes: '',
      summary: 'Learn about compound components, render props, and other advanced patterns in React.'
    },
    {
      id: '5LrDIWkK_Bc',
      title: 'State Management with Context API',
      thumbnail: 'https://i.ytimg.com/vi/5LrDIWkK_Bc/hqdefault.jpg',
      duration: '18:45',
      order: 3,
      watched: false,
      notes: '',
      summary: 'Managing global state in React applications using the Context API.'
    },
    {
      id: 'rfscVS0vtbw',
      title: 'JavaScript Crash Course',
      thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg',
      duration: '28:12',
      order: 4,
      watched: false,
      notes: '',
      summary: 'A comprehensive introduction to JavaScript fundamentals.'
    },
    {
      id: 'o3IIobN4xR0',
      title: 'Building a REST API with Node.js',
      thumbnail: 'https://i.ytimg.com/vi/o3IIobN4xR0/hqdefault.jpg',
      duration: '32:45',
      order: 5,
      watched: false,
      notes: '',
      summary: 'Creating a RESTful API using Node.js and Express.'
    }
  ];

  // Mock journeys data
  const mockJourneys: Journey[] = [
    {
      id: 'journey-1',
      title: 'React Development Masterclass',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
      totalVideos: 15,
      totalDays: 10,
      startDate: '2025-11-01',
      endDate: '2025-11-10',
      videos: mockVideos,
      currentVideoIndex: 2,
      focusScore: 82,
      streak: 5,
      lastPlayedDate: '2025-11-12',
      progress: 60
    },
    {
      id: 'journey-2',
      title: 'JavaScript Fundamentals',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
      totalVideos: 12,
      totalDays: 7,
      startDate: '2025-11-05',
      endDate: '2025-11-12',
      videos: mockVideos.slice(0, 3),
      currentVideoIndex: 1,
      focusScore: 75,
      streak: 3,
      lastPlayedDate: '2025-11-11',
      progress: 45
    },
    {
      id: 'journey-3',
      title: 'Node.js Backend Development',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
      totalVideos: 20,
      totalDays: 14,
      startDate: '2025-11-10',
      endDate: '2025-11-24',
      videos: mockVideos,
      currentVideoIndex: 0,
      focusScore: 68,
      streak: 2,
      lastPlayedDate: '2025-11-10',
      progress: 20
    }
  ];

  // Load mock journeys on component mount
  useEffect(() => {
    setJourneys(mockJourneys);
  }, []);

  // Handle fetching playlist data
  const handleFetchPlaylist = async () => {
    if (!playlistUrl) {
      setError('Please enter a YouTube playlist URL');
      return;
    }
    
    if (!journeyTitle) {
      setError('Please enter a journey title');
      return;
    }
    
    if (totalDays <= 0) {
      setError('Please enter a valid number of days');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create journey data
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + totalDays);
      
      const newJourney: Journey = {
        id: `journey-${journeys.length + 1}`,
        title: journeyTitle,
        playlistUrl,
        totalVideos: mockVideos.length,
        totalDays,
        startDate: today.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        videos: mockVideos,
        currentVideoIndex: 0,
        focusScore: 75,
        streak: 1,
        lastPlayedDate: today.toISOString().split('T')[0],
        progress: 0
      };
      
      // Add new journey to the list
      setJourneys([...journeys, newJourney]);
      
      // Reset form
      setPlaylistUrl('');
      setJourneyTitle('');
      setTotalDays(7);
      
      // Switch to list view
      setView('list');
    } catch (err) {
      setError('Failed to fetch playlist data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate daily schedule
  const generateDailySchedule = (journeyData: Journey) => {
    const schedule = [];
    const videosPerDay = Math.ceil(journeyData.videos.length / journeyData.totalDays);
    
    for (let day = 1; day <= journeyData.totalDays; day++) {
      const startIndex = (day - 1) * videosPerDay;
      const endIndex = Math.min(startIndex + videosPerDay, journeyData.videos.length);
      const dayVideos = journeyData.videos.slice(startIndex, endIndex);
      
      schedule.push({
        day,
        videos: dayVideos
      });
    }
    
    setDailySchedule(schedule);
  };

  // Handle video navigation
  const playVideo = (index: number) => {
    if (journey) {
      // Save notes for the previous video
      if (notes !== journey.videos[journey.currentVideoIndex].notes) {
        saveNotes();
      }
      
      const updatedJourney = {
        ...journey,
        currentVideoIndex: index
      };
      setJourney(updatedJourney);
      setNotes(updatedJourney.videos[index].notes);
      setIsPlaying(false);
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Move to next video
  const nextVideo = () => {
    if (journey && journey.currentVideoIndex < journey.videos.length - 1) {
      playVideo(journey.currentVideoIndex + 1);
    }
  };

  // Move to previous video
  const prevVideo = () => {
    if (journey && journey.currentVideoIndex > 0) {
      playVideo(journey.currentVideoIndex - 1);
    }
  };

  // Mark video as watched
  const toggleWatched = (index: number) => {
    if (journey) {
      const updatedVideos = [...journey.videos];
      updatedVideos[index].watched = !updatedVideos[index].watched;
      
      // Update progress
      const watchedCount = updatedVideos.filter(video => video.watched).length;
      const newProgress = Math.round((watchedCount / updatedVideos.length) * 100);
      
      const updatedJourney = {
        ...journey,
        videos: updatedVideos,
        progress: newProgress
      };
      
      setJourney(updatedJourney);
      
      // Update in journeys list
      const updatedJourneys = journeys.map(j => 
        j.id === journey.id ? updatedJourney : j
      );
      setJourneys(updatedJourneys);
    }
  };

  // Save notes for current video
  const saveNotes = () => {
    if (journey) {
      const updatedVideos = [...journey.videos];
      updatedVideos[journey.currentVideoIndex].notes = notes;
      
      const updatedJourney = {
        ...journey,
        videos: updatedVideos
      };
      
      setJourney(updatedJourney);
      
      // Update in journeys list
      const updatedJourneys = journeys.map(j => 
        j.id === journey.id ? updatedJourney : j
      );
      setJourneys(updatedJourneys);
    }
  };

  // Toggle focus mode
  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
  };

  // Calculate days remaining
  const daysRemaining = (journey: Journey) => {
    const today = new Date();
    const end = new Date(journey.endDate);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Reset the page to create a new journey
  const resetJourney = () => {
    setJourney(null);
    setPlaylistUrl('');
    setJourneyTitle('');
    setTotalDays(7);
    setNotes('');
    setError('');
  };

  // View a specific journey
  const viewJourney = (journey: Journey) => {
    setJourney(journey);
    setNotes(journey.videos[journey.currentVideoIndex].notes);
    generateDailySchedule(journey);
    setView('detail');
  };

  // Toggle day expansion in schedule
  const toggleDayExpansion = (day: number) => {
    if (expandedDays.includes(day)) {
      setExpandedDays(expandedDays.filter(d => d !== day));
    } else {
      setExpandedDays([...expandedDays, day]);
    }
  };

  // Render journey list view
  const renderJourneyList = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Smart Journeys</h1>
            <p className="text-gray-600 mt-2">Your personalized learning paths</p>
          </div>
          <Button 
            onClick={() => setView('create')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg font-semibold flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Journey
          </Button>
        </div>
        
        {journeys.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardContent className="text-center py-12">
              <BookOpenCheck className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Journeys Yet</h3>
              <p className="text-gray-600 mb-6">Create your first smart learning journey to get started</p>
              <Button 
                onClick={() => setView('create')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg font-semibold"
              >
                Create Your First Journey
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeys.map((journey) => (
              <Card 
                key={journey.id} 
                className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                onClick={() => viewJourney(journey)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2">
                      {journey.title}
                    </CardTitle>
                    <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {journey.totalVideos} videos
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{journey.progress}% complete</span>
                      <span>{daysRemaining(journey)} days left</span>
                    </div>
                    <Progress value={journey.progress} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>{journey.streak} day streak</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Zap className="h-4 w-4 mr-1 text-blue-500" />
                        <span>{journey.focusScore}% focus</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Render playlist input form
  const renderPlaylistForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create New Journey</h1>
          <Button 
            onClick={() => setView('list')}
            variant="outline"
            className="flex items-center"
          >
            Back to Journeys
          </Button>
        </div>
        
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Create Your Smart Learning Journey
            </CardTitle>
            <p className="text-gray-600">
              Paste a YouTube playlist link to start your personalized learning path
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playlistUrl" className="text-gray-700">YouTube Playlist URL</Label>
                <Input
                  id="playlistUrl"
                  type="url"
                  placeholder="https://www.youtube.com/playlist?list=..."
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  className="py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="journeyTitle" className="text-gray-700">Journey Title</Label>
                  <Input
                    id="journeyTitle"
                    type="text"
                    placeholder="My Learning Path"
                    value={journeyTitle}
                    onChange={(e) => setJourneyTitle(e.target.value)}
                    className="py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="totalDays" className="text-gray-700">Total Days to Complete</Label>
                  <Input
                    id="totalDays"
                    type="number"
                    min="1"
                    placeholder="7"
                    value={totalDays}
                    onChange={(e) => setTotalDays(parseInt(e.target.value) || 7)}
                    className="py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Smart Features
                </h3>
                <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
                  <li>Auto-generated daily learning schedule</li>
                  <li>AI-powered video summaries</li>
                  <li>Focus tracking and streak monitoring</li>
                  <li>Smart notes assistant</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => setView('list')}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleFetchPlaylist}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Journey...
                  </span>
                ) : (
                  'Create Journey'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Render journey dashboard
  const renderJourneyDashboard = () => {
    if (!journey) return null;
    
    const currentVideo = journey.videos[journey.currentVideoIndex];
    const daysLeft = daysRemaining(journey);
    
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar - Journey Schedule */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Study Schedule</h2>
              <Button 
                onClick={() => setView('list')}
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-800"
              >
                <BookOpenCheck className="h-4 w-4 mr-1" />
                All Journeys
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-1">{journey.title}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {dailySchedule.map((day) => (
                <div key={day.day} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleDayExpansion(day.day)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800">Day {day.day}</span>
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {day.videos.length} videos
                      </span>
                    </div>
                    {expandedDays.includes(day.day) ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedDays.includes(day.day) && (
                    <div className="p-3 space-y-2">
                      {day.videos.map((video, index) => {
                        const videoIndex = journey.videos.findIndex(v => v.id === video.id);
                        const isCurrent = videoIndex === journey.currentVideoIndex;
                        
                        return (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              isCurrent 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => playVideo(videoIndex)}
                          >
                            <div className="flex items-start">
                              <div className="relative flex-shrink-0 mr-3">
                                <img 
                                  src={video.thumbnail} 
                                  alt={video.title} 
                                  className="w-16 h-10 rounded object-cover"
                                />
                                {video.watched && (
                                  <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  </div>
                                )}
                                {isCurrent && (
                                  <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                                    <div className="bg-white rounded-full w-2 h-2"></div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-800 truncate">
                                  {video.title}
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <span>{video.duration}</span>
                                  {video.watched && (
                                    <span className="ml-2 flex items-center text-green-600">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Watched
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">{journey.progress}%</span>
            </div>
            <Progress value={journey.progress} className="h-2" />
            <div className="flex items-center justify-between mt-3 text-sm">
              <div className="flex items-center text-gray-600">
                <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                <span>{journey.streak} day streak</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1 text-blue-500" />
                <span>{daysLeft} days left</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-800">{journey.title}</h1>
                <p className="text-sm text-gray-600">Day {Math.ceil((journey.currentVideoIndex + 1) / Math.ceil(journey.videos.length / journey.totalDays))} of {journey.totalDays}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={toggleFocusMode}
                  variant="outline"
                  size="sm"
                  className={`${focusMode ? 'bg-gray-800 text-white border-gray-800' : ''}`}
                >
                  {focusMode ? 'Exit Focus' : 'Focus Mode'}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Video Player and Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Video Player */}
            <div className="flex-1 bg-black flex items-center justify-center p-4">
              <div 
                ref={playerRef}
                className="w-full h-full max-w-4xl bg-gray-900 rounded-lg flex flex-col"
              >
                {/* Video Area */}
                <div className="flex-1 flex items-center justify-center relative bg-black rounded-t-lg">
                  <img 
                    src={currentVideo.thumbnail} 
                    alt={currentVideo.title} 
                    className="max-h-full max-w-full rounded-t-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      onClick={togglePlayPause}
                      className="bg-black/50 hover:bg-black/70 rounded-full p-4"
                    >
                      {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white" />}
                    </Button>
                  </div>
                </div>
                
                {/* Player Controls */}
                <div className="bg-gray-900 p-4 rounded-b-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button 
                        onClick={prevVideo}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-blue-400"
                        disabled={journey.currentVideoIndex === 0}
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      <Button 
                        onClick={togglePlayPause}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-blue-400"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      <Button 
                        onClick={nextVideo}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-blue-400"
                        disabled={journey.currentVideoIndex === journey.videos.length - 1}
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>
                      <Button 
                        onClick={() => setIsMuted(!isMuted)}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-blue-400"
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        onClick={() => toggleWatched(journey.currentVideoIndex)}
                        variant="ghost"
                        size="sm"
                        className={`text-sm ${currentVideo.watched ? 'text-green-500' : 'text-white hover:text-green-500'}`}
                      >
                        {currentVideo.watched ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" /> Watched
                          </>
                        ) : (
                          <>
                            <Circle className="h-4 w-4 mr-1" /> Mark Watched
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Video Info and Notes */}
            <div className="bg-white border-t border-gray-200">
              <div className="max-w-4xl mx-auto">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{currentVideo.title}</h2>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Youtube className="h-4 w-4 mr-1 text-red-600" />
                        <span>Video {journey.currentVideoIndex + 1} of {journey.videos.length}</span>
                        <span className="mx-2">•</span>
                        <span>{currentVideo.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Summary */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-800">AI Summary</span>
                    </div>
                    <p className="text-gray-700 mt-2">
                      {currentVideo.summary || 'After watching this video, an AI-generated summary will appear here to help you quickly grasp the key concepts.'}
                    </p>
                  </div>
                  
                  {/* Notes Section */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-800 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        Notes
                      </h3>
                      <Button 
                        onClick={saveNotes}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save Notes
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Take notes while watching the video..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full">
      {view === 'list' && renderJourneyList()}
      {view === 'create' && renderPlaylistForm()}
      {view === 'detail' && renderJourneyDashboard()}
    </div>
  );
}