import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { useState, useEffect } from 'react';
import { HomePage } from './components/pages/HomePage';
import { ComingSoon } from './components/pages/ComingSoon';
import { StudyFlowPage } from './components/pages/StudyFlowPage';
import { FloatingParrot } from './components/FloatingParrot';
import { UtilitiesPage } from './components/pages/UtilitiesPage';
import { StudyRoomPage } from './components/pages/StudyRoomPage';
import { LoginPage } from './components/pages/LoginPage';
import { SmartJourneyPage } from './components/pages/SmartJourneyPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Simulate API call to check if user is already logged in
      await new Promise(resolve => setTimeout(resolve, 500));
      // For demo purposes, we'll default to not authenticated
      setIsAuthenticated(false);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const renderPage = () => {
    // Show loading state while checking auth
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading FocusLearn...</p>
          </div>
        </div>
      );
    }

    // Show login page if user is not authenticated
    if (!isAuthenticated) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'study-flow':
        return <StudyFlowPage />;
      case 'smart-journey':
        return <SmartJourneyPage />;
      case 'notes-buddy':
        return <ComingSoon pageName="Notes Buddy" />;
      case 'study-rooms':
        return <StudyRoomPage />;
      case 'planner':
        return <ComingSoon pageName="Planner" />;
      case 'collaboration':
        return <ComingSoon pageName="Collaboration" />;
      case 'utilities':
        return <UtilitiesPage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ComingSoon pageName="Profile" />;
      case 'settings':
        return <ComingSoon pageName="Settings" />;
      default:
        return <HomePage />;
    }
  };

  // Don't show header/sidebar when not authenticated or still loading
  const showHeader = isAuthenticated && !isLoading;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Subheader */}
      {showHeader && (
        <div className="bg-slate-800 text-white px-8 py-2 relative z-50">
          <p className="text-sm text-slate-300 text-center">Focus On What, We Handle The How</p>
        </div>
      )}
      
      {/* Header with Gradient */}
      {showHeader && (
        <header className="bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400 text-white px-8 py-4 shadow-lg relative z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-white">FocusLearn</h1>
          </div>
        </header>
      )}

      {/* Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - positioned below headers */}
        {showHeader && (
          <Sidebar 
            onNavigate={setCurrentPage} 
            currentPage={currentPage} 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={handleLogout}
          />
        )}

        {/* Overlay - Click anywhere to close sidebar, but below headers */}
        {sidebarOpen && showHeader && (
          <div 
            className="fixed bg-black/50 z-30"
            style={{ top: 'calc(2.5rem + 4rem)', left: 0, right: 0, bottom: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area - Full width, not affected by sidebar */}
        <main className="w-full overflow-y-auto bg-slate-50">
          {renderPage()}
        </main>
      </div>
      
      {/* Floating Parrot AI Chatbot */}
      {showHeader && <FloatingParrot />}
    </div>
  );
}