import React, { memo } from 'react';

interface MessageProps {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  formatTime: (timestamp: string) => string;
}

const Message: React.FC<MessageProps> = ({ id, content, role, timestamp, formatTime }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className={`message-avatar ${isUser ? 'user-avatar' : 'assistant-avatar'}`}>
        {isUser ? 'U' : 'H'}
      </div>
      <div className="message-content">
        <div className="message-text">{content}</div>
        <div className="message-timestamp">
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(Message);
