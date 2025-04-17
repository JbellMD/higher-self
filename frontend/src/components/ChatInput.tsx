import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import {
  Flex,
  Textarea,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import { FaPaperPlane } from 'react-icons/fa';
import { useChat } from '../contexts/ChatContext';
import { useThemeValue } from '../hooks/useThemeValue';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading } = useChat();
  
  // Colors based on theme
  const inputBg = useThemeValue('gray.100', 'gray.700');
  const inputHoverBg = useThemeValue('gray.200', 'gray.600');
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      await sendMessage(message.trim());
      setMessage('');
      
      // Focus the input after sending
      if (inputRef.current) {
        inputRef.current.focus();
        // Reset height after sending
        inputRef.current.style.height = 'auto';
      }
    }
  };
  
  // Handle key press events (Enter to send, Shift+Enter for new line)
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Auto-resize textarea based on content
  const resizeTextarea = () => {
    if (inputRef.current) {
      // Reset height to get the correct scrollHeight
      inputRef.current.style.height = 'auto';
      // Set the height to match content (with a max height constraint applied via CSS)
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  };
  
  // Update textarea height when message changes
  useEffect(() => {
    resizeTextarea();
  }, [message]);
  
  return (
    <Flex
      position="sticky"
      bottom="60px"
      p={4}
      bg={useThemeValue('white', 'gray.800')}
      borderTopWidth="1px"
      borderTopColor={useThemeValue('gray.200', 'gray.700')}
      w="100%"
      mb="0"
    >
      <Flex
        w="100%"
        maxW="1200px"
        mx="auto"
        align="center"
        boxShadow="md"
        borderRadius="lg"
        bg={inputBg}
        _hover={{ bg: inputHoverBg }}
        transition="all 0.2s"
      >
        <Textarea
          ref={inputRef}
          flex={1}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          variant="outline"
          px={4}
          py={3}
          disabled={isLoading}
          resize="none"
          minH="40px"
          maxH="200px"
          overflow="auto"
          rows={1}
        />
        
        <IconButton
          aria-label="Send message"
          colorScheme="brand"
          borderRadius="lg"
          m={1}
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : <FaPaperPlane />}
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default ChatInput;
