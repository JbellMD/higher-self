import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { format } from 'date-fns';

// Define types for our chat context
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  createSession: () => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newTitle: string) => void;
  sendMessage: (content: string) => Promise<void>;
  currentSession: ChatSession | null;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get the current session
  const currentSession = currentSessionId
    ? sessions.find(session => session.id === currentSessionId) || null
    : null;

  // Load sessions from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    const savedCurrentSessionId = localStorage.getItem('currentSessionId');
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    
    if (savedCurrentSessionId) {
      setCurrentSessionId(savedCurrentSessionId);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Save current session ID to localStorage whenever it changes
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('currentSessionId', currentSessionId);
    }
  }, [currentSessionId]);

  // Create a new session
  const createSession = () => {
    const now = new Date();
    const formattedDate = format(now, 'MMM d, yyyy h:mm a');
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `New Smile ${format(now, 'MMM d, yyyy')}`,
      messages: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    
    setSessions(prevSessions => [...prevSessions, newSession]);
    setCurrentSessionId(newSession.id);
  };

  // Select a session
  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  // Delete a session
  const deleteSession = (sessionId: string) => {
    setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
    
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
      } else {
        setCurrentSessionId(null);
      }
    }
  };

  // Rename a session
  const renameSession = (sessionId: string, newTitle: string) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? { ...session, title: newTitle, updatedAt: new Date().toISOString() }
          : session
      )
    );
  };

  // Send a message
  const sendMessage = async (content: string) => {
    if (!currentSessionId) {
      createSession();
    }
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
    };
    
    // Update session with user message
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage],
              updatedAt: new Date().toISOString(),
            }
          : session
      )
    );
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Get message history for context
      const messageHistory = currentSession?.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })) || [];
      
      // Call the API
      const response = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationId: currentSessionId,
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
      
      // Update session with assistant message
      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: [...session.messages, assistantMessage],
                updatedAt: new Date().toISOString(),
              }
            : session
        )
      );
      
      // Update session title if it's the first message
      if (currentSession && currentSession.messages.length === 0 && currentSessionId) {
        const title = content.length > 30 ? `${content.substring(0, 30)}...` : content;
        renameSession(currentSessionId, title);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      
      // Update session with error message
      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: [...session.messages, errorMessage],
                updatedAt: new Date().toISOString(),
              }
            : session
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Create default session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      createSession();
    }
  }, [sessions]);

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSessionId,
        isLoading,
        createSession,
        selectSession,
        deleteSession,
        renameSession,
        sendMessage,
        currentSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
