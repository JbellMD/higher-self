import React, { useState, useEffect, useRef } from 'react';
import './App.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPinned: boolean;
  category: string;
}

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [sessionToRename, setSessionToRename] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [sessionTags, setSessionTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [categories, setCategories] = useState<string[]>(['General', 'Personal', 'Work', 'Ideas']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Suggested prompts for empty chat
  const suggestedPrompts = [
    "Tell me something that will make me smile today",
    "How can I spread more joy in my life?",
    "Share a funny story with me",
    "What's a good way to brighten someone's day?"
  ];

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    const savedCurrentSession = localStorage.getItem('currentSessionId');
    const savedTheme = localStorage.getItem('darkMode');

    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      setSessions(parsedSessions);
      
      if (savedCurrentSession && parsedSessions.some((s: ChatSession) => s.id === savedCurrentSession)) {
        setCurrentSessionId(savedCurrentSession);
        const currentSession = parsedSessions.find((s: ChatSession) => s.id === savedCurrentSession);
        if (currentSession) {
          setMessages(currentSession.messages);
        }
      } else if (parsedSessions.length > 0) {
        // If no current session is saved or it doesn't exist, use the first session
        setCurrentSessionId(parsedSessions[0].id);
        setMessages(parsedSessions[0].messages);
      }
    } else {
      // Create a default session if none exist
      createNewSession();
    }

    // Only set dark mode from localStorage if it exists, otherwise use default (true)
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
      localStorage.setItem('currentSessionId', currentSessionId);
    }
  }, [sessions, currentSessionId]);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update current session messages when messages change
  useEffect(() => {
    if (currentSessionId && messages.length >= 0) {
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === currentSessionId 
            ? { 
                ...session, 
                messages, 
                updatedAt: new Date().toISOString(),
                title: session.title === 'New Chat' && messages.length > 0 
                  ? truncateTitle(messages[0].content) 
                  : session.title
              } 
            : session
        )
      );
    }
  }, [messages, currentSessionId]);

  // Filter sessions based on search term, tags, and category
  const filteredSessions = sessions
    .filter(session => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by category
      const matchesCategory = selectedCategory === 'All' || session.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by pinned status first (pinned sessions at the top)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then sort by updated date (newest first)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      isPinned: false,
      category: 'General'
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setSidebarOpen(false);
  };

  // Toggle pin status for a session
  const togglePinSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === sessionId 
          ? { ...session, isPinned: !session.isPinned } 
          : session
      )
    );
  };

  // Add tag to current session
  const addTagToSession = (tag: string) => {
    if (!tag.trim() || !currentSessionId) return;
    
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === currentSessionId 
          ? { 
              ...session, 
              tags: session.tags.includes(tag) 
                ? session.tags 
                : [...session.tags, tag] 
            } 
          : session
      )
    );
    
    // Add to available tags if it's a new tag
    if (!sessionTags.includes(tag)) {
      setSessionTags(prev => [...prev, tag]);
    }
    
    setNewTag('');
    setShowTagInput(false);
  };

  // Remove tag from current session
  const removeTagFromSession = (tag: string) => {
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === currentSessionId 
          ? { 
              ...session, 
              tags: session.tags.filter(t => t !== tag)
            } 
          : session
      )
    );
  };

  // Change category of current session
  const changeSessionCategory = (category: string) => {
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === currentSessionId 
          ? { ...session, category } 
          : session
      )
    );
  };

  // Export selected sessions or current session
  const exportSessions = () => {
    const sessionsToExport = isMultiSelectMode && selectedSessions.length > 0
      ? sessions.filter(session => selectedSessions.includes(session.id))
      : sessions.filter(session => session.id === currentSessionId);
    
    const dataStr = JSON.stringify(sessionsToExport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `smile-history-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import sessions from file
  const importSessions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSessions = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedSessions)) {
          // Generate new IDs to avoid conflicts
          const newSessions = importedSessions.map(session => ({
            ...session,
            id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }));
          
          setSessions(prev => [...prev, ...newSessions]);
          
          // Switch to the first imported session
          if (newSessions.length > 0) {
            setCurrentSessionId(newSessions[0].id);
            setMessages(newSessions[0].messages);
          }
        }
      } catch (error) {
        console.error('Error importing sessions:', error);
        alert('Failed to import sessions. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  // Toggle multi-select mode
  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    setSelectedSessions([]);
  };

  // Toggle session selection in multi-select mode
  const toggleSessionSelection = (sessionId: string, e: React.MouseEvent) => {
    if (!isMultiSelectMode) return;
    
    e.stopPropagation();
    setSelectedSessions(prev => 
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  // Delete selected sessions
  const deleteSelectedSessions = () => {
    if (selectedSessions.length === 0) return;
    
    // Filter out the sessions to delete
    const updatedSessions = sessions.filter(session => !selectedSessions.includes(session.id));
    
    if (updatedSessions.length === 0) {
      // If no sessions left, create a new one
      createNewSession();
    } else if (selectedSessions.includes(currentSessionId)) {
      // If current session is deleted, switch to the first available session
      setCurrentSessionId(updatedSessions[0].id);
      setMessages(updatedSessions[0].messages);
    }
    
    setSessions(updatedSessions);
    setSelectedSessions([]);
    setIsMultiSelectMode(false);
  };

  const selectSession = (sessionId: string) => {
    if (isMultiSelectMode) {
      toggleSessionSelection(sessionId, {} as React.MouseEvent);
      return;
    }
    
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      setSidebarOpen(false);
    }
  };

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Filter out the session to delete
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    
    if (updatedSessions.length === 0) {
      // If no sessions left, create a new one
      createNewSession();
    } else if (currentSessionId === sessionId) {
      // If current session is deleted, switch to the first available session
      setCurrentSessionId(updatedSessions[0].id);
      setMessages(updatedSessions[0].messages);
    }
    
    setSessions(updatedSessions);
  };

  const startRenameSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setSessionToRename(sessionId);
      setNewSessionName(session.title);
      setIsRenaming(true);
    }
  };

  const confirmRenameSession = () => {
    if (sessionToRename && newSessionName.trim()) {
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionToRename 
            ? { ...session, title: newSessionName.trim() } 
            : session
        )
      );
    }
    cancelRenameSession();
  };

  const cancelRenameSession = () => {
    setIsRenaming(false);
    setSessionToRename(null);
    setNewSessionName('');
  };

  const truncateTitle = (content: string) => {
    return content.length > 25 ? content.substring(0, 25) + '...' : content;
  };

  const handleSendMessage = async (content: string = input) => {
    if ((!content.trim() && !input.trim()) || isLoading) return;

    const messageContent = content.trim() || input.trim();

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get message history for context
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call the API
      const response = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          messageHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.data.message,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSuggestionClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Function to format the timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to format date for sidebar
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'} ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Smile History</h2>
          <button className="sidebar-close" onClick={toggleSidebar}>×</button>
        </div>
        <button className="new-chat-button" onClick={createNewSession}>
          <span>+</span> New Smile
        </button>
        <div className="session-list">
          {filteredSessions.map(session => (
            <div 
              key={session.id} 
              className={`session-item ${currentSessionId === session.id ? 'active-session' : ''} ${selectedSessions.includes(session.id) ? 'selected' : ''}`}
              onClick={() => selectSession(session.id)}
            >
              {isMultiSelectMode && (
                <input 
                  type="checkbox"
                  className="multi-select-checkbox"
                  checked={selectedSessions.includes(session.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleSessionSelection(session.id, e as unknown as React.MouseEvent);
                  }}
                />
              )}
              
              {session.isPinned && <span className="pinned-indicator">📌</span>}
              
              <div className="session-info">
                <div className="session-title">
                  {isRenaming && sessionToRename === session.id ? (
                    <div className="rename-input-container" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={newSessionName}
                        onChange={(e) => setNewSessionName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && confirmRenameSession()}
                        autoFocus
                      />
                      <div className="rename-actions">
                        <button onClick={confirmRenameSession}>✓</button>
                        <button onClick={cancelRenameSession}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <span>{session.title}</span>
                  )}
                </div>
                <div className="session-meta">
                  <span className="session-date">{formatDate(session.updatedAt)}</span>
                  {session.tags.length > 0 && (
                    <div className="session-item-tags">
                      {session.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="session-item-tag">{tag}</span>
                      ))}
                      {session.tags.length > 2 && (
                        <span className="session-item-tag">+{session.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                  <span className="session-category-badge">{session.category}</span>
                </div>
              </div>
              
              <div className="session-actions">
                {!isMultiSelectMode && (
                  <>
                    <button 
                      className="session-action rename-button" 
                      onClick={(e) => startRenameSession(session.id, e)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="session-action delete-button" 
                      onClick={(e) => deleteSession(session.id, e)}
                    >
                      🗑️
                    </button>
                    <button 
                      className="session-action pin-button" 
                      onClick={(e) => togglePinSession(session.id, e)}
                    >
                      {session.isPinned ? '📌' : '📋'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="session-filters">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search sessions"
          />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="session-actions">
            <button 
              onClick={toggleMultiSelectMode} 
              className="multi-select-button" 
              title={isMultiSelectMode ? "Exit selection mode" : "Select multiple sessions"}
            >
              {isMultiSelectMode ? 'Exit Selection' : 'Select Multiple'}
            </button>
            {isMultiSelectMode && selectedSessions.length > 0 && (
              <button 
                onClick={deleteSelectedSessions} 
                className="delete-selected-button" 
                title="Delete selected sessions"
              >
                Delete Selected ({selectedSessions.length})
              </button>
            )}
            <label className="import-button" title="Import sessions">
              Import
              <input 
                type="file" 
                accept=".json" 
                onChange={importSessions}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <header className="App-header">
          <div className="header-left">
            <button className="menu-button" onClick={toggleSidebar}>☰</button>
            <h1>{currentSession?.title || 'The Always Laughing Smile'}</h1>
          </div>
          <div className="App-header-actions">
            <label className="toggle-switch" title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <span className="toggle-slider">
                <span className="toggle-icon">{darkMode ? '🌙' : '☀️'}</span>
              </span>
            </label>
            <button onClick={clearChat} className="clear-button" title="Clear current chat">
              <span className="clear-icon">🗑️</span>
              Clear Smile
            </button>
            <button onClick={exportSessions} className="export-button" title="Export sessions">
              <span className="export-icon">📁</span>
              Export
            </button>
            <input 
              type="file" 
              accept=".json" 
              onChange={importSessions} 
              title="Import sessions"
            />
            <button 
              onClick={toggleMultiSelectMode} 
              className="multi-select-button" 
              title="Toggle multi-select mode"
            >
              {isMultiSelectMode ? '✕' : '🗑️'}
            </button>
            {isMultiSelectMode && (
              <button 
                onClick={deleteSelectedSessions} 
                className="delete-selected-button" 
                title="Delete selected sessions"
              >
                🗑️
              </button>
            )}
          </div>
        </header>
        
        <div className="chat-container">
          <div className="shooting-star-2"></div>
          {messages.length === 0 ? (
            <div className="empty-chat">
              <h2 className="welcome-title">
                The Always Laughing Smile
              </h2>
              {/* Removed the descriptive text as requested */}
              <div className="empty-chat-suggestions">
                {suggestedPrompts.map((prompt, index) => (
                  <button 
                    key={index} 
                    className="suggestion-chip"
                    onClick={() => handleSuggestionClick(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Session metadata section */}
              <div className="session-metadata">
                {currentSession && (
                  <>
                    <div className="session-category">
                      <label>Category:</label>
                      <select 
                        value={currentSession.category} 
                        onChange={(e) => changeSessionCategory(e.target.value)}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="session-tags">
                      <div className="tags-container">
                        {currentSession.tags.map(tag => (
                          <div key={tag} className="tag">
                            <span>{tag}</span>
                            <button onClick={() => removeTagFromSession(tag)}>×</button>
                          </div>
                        ))}
                        
                        {showTagInput ? (
                          <div className="tag-input-container">
                            <input
                              type="text"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addTagToSession(newTag)}
                              placeholder="Add tag..."
                              autoFocus
                            />
                            <div className="tag-actions">
                              <button onClick={() => addTagToSession(newTag)}>✓</button>
                              <button onClick={() => setShowTagInput(false)}>✕</button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            className="add-tag-button" 
                            onClick={() => setShowTagInput(true)}
                          >
                            + Add Tag
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="messages">
                {messages.map((message) => {
                  const isUser = message.role === 'user';
                  return (
                    <div 
                      key={message.id} 
                      className={`message ${isUser ? 'user-message' : 'assistant-message'} slide-in`}
                    >
                      <div className={`message-avatar ${isUser ? 'user-avatar' : 'assistant-avatar'}`}>
                        {isUser ? 'U' : 'H'}
                      </div>
                      <div className="message-bubble">
                        <div className="message-content">{message.content}</div>
                        <div className="message-timestamp">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="message assistant-message slide-in">
                    <div className="message-avatar assistant-avatar">H</div>
                    <div className="message-bubble">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>
        
        <div className="input-container">
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts with a smile..."
            disabled={isLoading}
          />
          <button 
            className="send-button"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            title="Send message"
          >
            {!isLoading && <span className="send-icon">➤</span>}
            {isLoading && <span className="loading-icon">...</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
