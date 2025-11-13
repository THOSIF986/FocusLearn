import { Home, BookOpen, Wrench, User, Menu, LogOut, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState, useMemo } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  subItems?: { id: string; label: string }[];
}

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void; // Make logout optional to avoid breaking existing usage
}

export function Sidebar({ onNavigate, currentPage, isOpen, onClose, onLogout }: SidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'learning-hub',
      label: 'Learning Hub',
      icon: BookOpen,
      subItems: [
        { id: 'study-flow', label: 'Study Flow' },
        { id: 'smart-journey', label: 'Smart Journey' },
        { id: 'notes-buddy', label: 'Notes Buddy' },
      ],
    },
    {
      id: 'learning-tools',
      label: 'Learning Tools',
      icon: Wrench,
      subItems: [
        { id: 'study-rooms', label: 'Study Rooms' },
        { id: 'planner', label: 'Planner' },
        { id: 'collaboration', label: 'Collaboration' },
        { id: 'utilities', label: 'Utilities' },
      ],
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      subItems: [
        { id: 'profile', label: 'Profile' },
        { id: 'settings', label: 'Settings' },
      ],
    },
  ];

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleNavigate = (pageId: string) => {
    onNavigate(pageId);
    setSearchQuery(''); // Clear search when navigating
    // Close sidebar after navigation
    onClose();
  };

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const results: { parent: string; label: string; parentIcon: any; id: string }[] = [];

    menuItems.forEach((item) => {
      // Check if main menu item matches
      if (item.label.toLowerCase().includes(query)) {
        results.push({
          parent: '',
          label: item.label,
          parentIcon: item.icon,
          id: item.id,
        });
      }

      // Check sub-items
      item.subItems?.forEach((subItem) => {
        if (subItem.label.toLowerCase().includes(query)) {
          results.push({
            parent: item.label,
            label: subItem.label,
            parentIcon: item.icon,
            id: subItem.id,
          });
        }
      });
    });

    return results;
  }, [searchQuery]);

  return (
    <div className={`w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out fixed left-0 z-40 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`} style={{ top: 'calc(2.5rem + 4rem)', bottom: 0 }}>
      {/* Search */}
      <div className="p-4 pt-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="text" 
            placeholder="Search for feature..." 
            className="w-full bg-slate-800 border-slate-700 text-white pl-10 placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Search Results Dropdown */}
        {searchQuery.trim() && (
          <div className="absolute top-full left-4 right-4 bg-white border border-slate-300 border-t-0 rounded-b max-h-64 overflow-y-auto shadow-lg z-50">
            {searchResults.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-600">
                No results found
              </div>
            ) : (
              <div className="py-2">
                {searchResults.map((result, index) => {
                  const Icon = result.parentIcon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleNavigate(result.id)}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 transition-colors flex items-center gap-3"
                    >
                      <Icon className="w-4 h-4 text-slate-600" />
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-900">{result.label}</span>
                        {result.parent && (
                          <span className="text-xs text-slate-500">
                            in {result.parent}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <button 
          onClick={() => handleNavigate('home')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            currentPage === 'home' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>
        
        {/* Learning Hub */}
        <div>
          <button 
            onClick={() => toggleMenu('learning-hub')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>Learning Hub</span>
            {openMenu === 'learning-hub' ? (
              <ChevronDown className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </button>
          
          {openMenu === 'learning-hub' && (
            <div className="ml-8 mt-1 space-y-1">
              <button 
                onClick={() => handleNavigate('study-flow')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === 'study-flow' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Study Flow
              </button>
              <button 
                onClick={() => handleNavigate('smart-journey')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === 'smart-journey' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Smart Journey
              </button>
              <button 
                onClick={() => handleNavigate('notes-buddy')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === 'notes-buddy' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Notes Buddy
              </button>
            </div>
          )}
        </div>
        
        {/* Learning Tools */}
        <div>
          <button 
            onClick={() => toggleMenu('learning-tools')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Wrench className="w-5 h-5" />
            <span>Learning Tools</span>
            {openMenu === 'learning-tools' ? (
              <ChevronDown className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </button>
          
          {openMenu === 'learning-tools' && (
            <div className="ml-8 mt-1 space-y-1">
              <button 
                onClick={() => handleNavigate('study-rooms')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === 'study-rooms' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Study Rooms
              </button>
              <button 
                onClick={() => handleNavigate('planner')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === 'planner' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Planner
              </button>
              <button 
                onClick={() => handleNavigate('collaboration')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === 'collaboration' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Collaboration
              </button>
              <button 
                onClick={() => handleNavigate('utilities')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === 'utilities' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Utilities
              </button>
            </div>
          )}
        </div>
        
        {/* Account */}
        <div>
          <button 
            onClick={() => toggleMenu('account')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <User className="w-5 h-5" />
            <span>Account</span>
            {openMenu === 'account' ? (
              <ChevronDown className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </button>
          
          {openMenu === 'account' && (
            <div className="ml-8 mt-1 space-y-1">
              <button 
                onClick={() => handleNavigate('profile')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Profile
              </button>
              <button 
                onClick={() => handleNavigate('settings')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Settings
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => {
            // Close sidebar first
            onClose();
            // Call the logout function if provided
            if (onLogout) {
              onLogout();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}