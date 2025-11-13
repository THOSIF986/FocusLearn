import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Download, FileText, Clock, BookOpen, Trash2, Search } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface SavedNote {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  videoId?: string;
  videoLink?: string;
  source?: 'study-flow' | 'smart-study' | 'notes-buddy' | 'study-rooms' | 'manual';
}

interface UtilitiesPageProps {
  onNavigate?: (page: string) => void;
}

export function UtilitiesPage({ onNavigate }: UtilitiesPageProps) {
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'study-flow' | 'smart-study' | 'notes-buddy' | 'study-rooms' | 'manual'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved notes from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('quickNotes');
    if (saved) {
      try {
        setSavedNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved notes', e);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quickNotes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  const handleDownloadNote = (note: SavedNote) => {
    const element = document.createElement('a');
    const file = new Blob([note.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteNote = (id: string) => {
    setSavedNotes(savedNotes.filter(note => note.id !== id));
  };

  // Filter notes based on active tab and search query
  const filteredNotes = (() => {
    let notes = activeTab === 'all' 
      ? savedNotes 
      : savedNotes.filter(note => note.source === activeTab);
      
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      notes = notes.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query) ||
        (note.videoLink && note.videoLink.toLowerCase().includes(query))
      );
    }
    
    return notes;
  })();

  // Get source label and icon
  const getSourceInfo = (source: string | undefined) => {
    switch (source) {
      case 'study-flow':
        return { label: 'Study Flow', color: 'bg-red-100 text-red-700' };
      case 'smart-study':
        return { label: 'Smart Study', color: 'bg-purple-100 text-purple-700' };
      case 'notes-buddy':
        return { label: 'Notes Buddy', color: 'bg-blue-100 text-blue-700' };
      case 'study-rooms':
        return { label: 'Study Rooms', color: 'bg-green-100 text-green-700' };
      default:
        return { label: 'Manual Note', color: 'bg-slate-100 text-slate-700' };
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Filters Section - Full Height Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          {/* Header for Utilities */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Utilities</h1>
            <p className="text-slate-600 text-sm mt-1">Manage your saved notes</p>
          </div>
          
          {/* Divider line below Utilities header */}
          <div className="border-t border-slate-200 mb-6"></div>
          
          {/* Source Filters */}
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === 'all'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="font-medium">All Notes</span>
              <span className="text-sm bg-slate-200 text-slate-700 rounded-full px-2 py-1">
                {savedNotes.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('study-flow')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === 'study-flow'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="font-medium">Study Flow</span>
              <span className="text-sm bg-slate-200 text-slate-700 rounded-full px-2 py-1">
                {savedNotes.filter(n => n.source === 'study-flow').length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('smart-study')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === 'smart-study'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="font-medium">Smart Study</span>
              <span className="text-sm bg-slate-200 text-slate-700 rounded-full px-2 py-1">
                {savedNotes.filter(n => n.source === 'smart-study').length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('notes-buddy')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === 'notes-buddy'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="font-medium">Notes Buddy</span>
              <span className="text-sm bg-slate-200 text-slate-700 rounded-full px-2 py-1">
                {savedNotes.filter(n => n.source === 'notes-buddy').length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('study-rooms')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === 'study-rooms'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="font-medium">Study Rooms</span>
              <span className="text-sm bg-slate-200 text-slate-700 rounded-full px-2 py-1">
                {savedNotes.filter(n => n.source === 'study-rooms').length}
              </span>
            </button>
          </div>
        </div>
        
        {/* Quick Actions - Pushed to bottom */}
        <div className="mt-auto p-6 pt-0">
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Quick Actions</h3>
            
            {/* Go to Home Button */}
            <button 
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left hover:bg-slate-100 text-slate-700 transition-all mb-2"
            >
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                <FileText className="w-4 h-4" />
              </div>
              <span>Go to Home</span>
            </button>
            
            {/* Go to Study Flow Button */}
            <button 
              onClick={() => onNavigate && onNavigate('study-flow')}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left hover:bg-slate-100 text-slate-700 transition-all"
            >
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>Go to Study Flow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto h-full">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
            {/* Results Header with Search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {activeTab === 'all' ? 'All Notes' : getSourceInfo(activeTab).label}
                </h2>
                <p className="text-slate-600 text-sm">
                  Showing {filteredNotes.length} of {savedNotes.length} notes
                </p>
              </div>
              
              {/* Search Bar - Moved to opposite side */}
              <div className="w-full md:w-80">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Notes List */}
            {savedNotes.length > 0 ? (
              <ScrollArea className="flex-1 pr-2">
                <div className="space-y-4">
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => {
                      const sourceInfo = getSourceInfo(note.source);
                      return (
                        <div 
                          key={note.id} 
                          className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${sourceInfo.color}`}>
                                <span className="ml-1.5">{sourceInfo.label}</span>
                              </span>
                              <h3 className="font-semibold text-slate-800 text-lg">{note.title}</h3>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleDownloadNote(note)}
                                variant="outline"
                                size="sm"
                                className="rounded-lg h-9 w-9 p-0 border-slate-300 hover:bg-slate-100"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteNote(note.id)}
                                variant="outline"
                                size="sm"
                                className="rounded-lg h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-xs text-slate-500 mb-4">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            {formatDate(note.timestamp)}
                            {note.videoLink && (
                              <span className="ml-3 text-blue-600 truncate max-w-xs">
                                From: {note.videoLink.substring(0, 40)}...
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-slate-700 text-sm whitespace-pre-wrap line-clamp-3">
                              {note.content}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-800 mb-2">No matching notes found</h3>
                      <p className="text-slate-600 max-w-md mx-auto">
                        Try adjusting your search or filter criteria to find what you're looking for.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center py-16">
                  <FileText className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                  <h3 className="text-xl font-medium text-slate-800 mb-3">No saved notes yet</h3>
                  <p className="text-slate-600 max-w-md mx-auto mb-6">
                    Start taking notes in Study Flow or other sections, and they'll appear here for easy access.
                  </p>
                  <button 
                    onClick={() => onNavigate && onNavigate('study-flow')}
                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Get Started with Study Flow
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}