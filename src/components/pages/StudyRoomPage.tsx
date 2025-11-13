import { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Paperclip, Mic, Send, Phone, Video, Plus, User, Users, Bell, BellOff, Archive, Trash2, Star, Smile, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Button } from '../ui/button';

interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
  isGroup: boolean;
  participants?: string[]; // For group chats
}

interface User {
  id: string;
  email: string;
  name: string;
  isOnline: boolean;
}

export function StudyRoomPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Chat states
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Math Study Group',
      lastMessage: 'Can someone explain problem 5?',
      timestamp: '10:30 AM',
      unread: 2,
      isOnline: true,
      isGroup: true,
      participants: ['1', '2', '3']
    },
    {
      id: '2',
      name: 'Physics Project Team',
      lastMessage: 'The presentation is due tomorrow',
      timestamp: '9:15 AM',
      unread: 0,
      isOnline: true,
      isGroup: true,
      participants: ['1', '4', '5']
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      lastMessage: 'See you in class!',
      timestamp: 'Yesterday',
      unread: 0,
      isOnline: false,
      isGroup: false
    },
    {
      id: '4',
      name: 'History Study Buddies',
      lastMessage: 'Did you finish the reading?',
      timestamp: 'Yesterday',
      unread: 5,
      isOnline: true,
      isGroup: true,
      participants: ['1', '6', '7']
    },
    {
      id: '5',
      name: 'Michael Chen',
      lastMessage: 'Thanks for the notes!',
      timestamp: 'Monday',
      unread: 0,
      isOnline: true,
      isGroup: false
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: '1', email: 'user@example.com', name: 'You', isOnline: true },
    { id: '2', email: 'sarah@example.com', name: 'Sarah Johnson', isOnline: false },
    { id: '3', email: 'mike@example.com', name: 'Michael Chen', isOnline: true },
    { id: '4', email: 'alex@example.com', name: 'Alex Turner', isOnline: true },
    { id: '5', email: 'emma@example.com', name: 'Emma Wilson', isOnline: false },
    { id: '6', email: 'david@example.com', name: 'David Brown', isOnline: true },
    { id: '7', email: 'lisa@example.com', name: 'Lisa Garcia', isOnline: true }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Sarah Johnson',
      senderId: '2',
      content: 'Hi everyone! Ready to start our study session?',
      timestamp: '10:25 AM',
      isOwn: false
    },
    {
      id: '2',
      sender: 'You',
      senderId: '1',
      content: 'Yes, I\'ve reviewed the material. What topic should we start with?',
      timestamp: '10:26 AM',
      isOwn: true
    },
    {
      id: '3',
      sender: 'Math Study Group',
      senderId: 'group-1',
      content: 'Let\'s start with calculus derivatives. I\'m still struggling with chain rule applications.',
      timestamp: '10:27 AM',
      isOwn: false
    },
    {
      id: '4',
      sender: 'You',
      senderId: '1',
      content: 'I can help with that. Let me share a good resource I found.',
      timestamp: '10:28 AM',
      isOwn: true
    },
    {
      id: '5',
      sender: 'Sarah Johnson',
      senderId: '2',
      content: 'That would be great! I\'m also confused about implicit differentiation.',
      timestamp: '10:30 AM',
      isOwn: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState('1');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    // Find user by email
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      // Update user status to online
      setUsers(users.map(u => 
        u.id === user.id ? {...u, isOnline: true} : u
      ));
    } else {
      alert('User not found. Please check your credentials or register.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password || !name) {
      alert('Please fill in all fields');
      return;
    }
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      alert('User already exists. Please login instead.');
      return;
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      isOnline: true
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (currentUser) {
      // Update user status to offline
      setUsers(users.map(u => 
        u.id === currentUser.id ? {...u, isOnline: false} : u
      ));
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setName('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: currentUser.name,
      senderId: currentUser.id,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Update the last message in the chat list
    setChats(chats.map(chat => 
      chat.id === activeChat 
        ? { ...chat, lastMessage: newMessage, timestamp: 'now' } 
        : chat
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If not authenticated, show login/register form
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Study Rooms</h1>
            <p className="text-gray-600">
              {isRegistering ? 'Create an account to join study rooms' : 'Sign in to your study rooms'}
            </p>
          </div>
          
          {isRegistering ? (
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-email">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-password">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Create a password"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your password"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-green-500 hover:text-green-700 font-medium"
            >
              {isRegistering 
                ? 'Already have an account? Sign In' 
                : 'Don\'t have an account? Register'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main chat interface (when authenticated)
  return (
    <div className="flex h-screen">
      {/* Left Icons Panel - 10% width */}
      <div className="w-[10%] flex flex-col bg-black text-white">
        {/* User Avatar */}
        <div className="p-4 flex justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {currentUser?.name.charAt(0)}
          </div>
        </div>
        
        {/* Navigation Icons */}
        <div className="flex-1 flex flex-col items-center py-4 space-y-8">
          <button className="p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
            <Users className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
            <Bell className="w-6 h-6" />
          </button>
        </div>
        
        {/* Settings Button at Bottom */}
        <div className="p-4 flex justify-center">
          <button className="p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Middle Chat List - 40% width */}
      <div className="w-[40%] flex flex-col bg-black text-white">
        {/* Chat List Header */}
        <div className="p-3 bg-gray-900 flex items-center justify-between">
          <h1 className="font-semibold text-lg text-white">Chats</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-800">
              <Plus className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-800">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="p-2 bg-black">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Chat List - Scrollable area */}
        <div className="flex-1 overflow-y-auto bg-black">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              className={`flex items-center p-3 hover:bg-gray-900 cursor-pointer ${
                activeChat === chat.id ? 'bg-gray-900' : ''
              }`}
              onClick={() => setActiveChat(chat.id)}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {chat.isGroup ? <Users className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                )}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-white truncate">{chat.name}</h2>
                  <span className="text-xs text-gray-400">{chat.timestamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Window - 50% width */}
      <div className="w-[50%] flex flex-col bg-white text-black">
        {/* Chat Header - Fixed at top */}
        {chats.find(chat => chat.id === activeChat) && (
          <div className="p-3 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {chats.find(chat => chat.id === activeChat)?.isGroup ? 
                    <Users className="w-5 h-5" /> : 
                    <User className="w-5 h-5" />
                  }
                </div>
                {chats.find(chat => chat.id === activeChat)?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-4">
                <h2 className="font-semibold text-black">
                  {chats.find(chat => chat.id === activeChat)?.name}
                </h2>
                <p className="text-xs text-gray-600">
                  {chats.find(chat => chat.id === activeChat)?.isOnline 
                    ? 'online' 
                    : 'offline'}
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-200">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Messages Area - Scrollable independently */}
        <div className="flex-1 overflow-y-auto p-4 relative">
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)', backgroundSize: '20px 20px'}}>
          </div>
          
          <div className="relative space-y-2">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn 
                      ? 'bg-blue-100 text-black rounded-br-none' 
                      : 'bg-gray-200 text-black rounded-bl-none'
                  }`}
                >
                  {!message.isOwn && (
                    <p className="text-xs font-semibold text-blue-600">{message.sender}</p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? 'text-gray-600' : 'text-gray-500'} text-right`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input - Fixed at bottom */}
        <div className="p-3 bg-gray-100 border-t border-gray-200">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-200">
              <Plus className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-200">
              <Smile className="w-5 h-5" />
            </Button>
            <div className="flex-1 mx-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message"
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {newMessage.trim() ? (
              <Button 
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
              >
                <Send className="w-5 h-5" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-200">
                <Mic className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}