import React, { memo } from 'react';

const LoadingIndicator: React.FC = () => {
  return (
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
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(LoadingIndicator);
