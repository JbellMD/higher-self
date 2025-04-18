import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import {
  Flex,
  Textarea,
  IconButton,
  Spinner,
  Box,
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
        inputRef.current.style.height = '40px';
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
  
  // Handle input change and resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto resize the textarea
    if (inputRef.current) {
      // Reset height temporarily to get the correct scrollHeight
      inputRef.current.style.height = '40px';
      
      // Set the height based on scrollHeight (capped at 200px)
      const newHeight = Math.min(inputRef.current.scrollHeight, 200);
      inputRef.current.style.height = `${newHeight}px`;
    }
  };
  
  return (
    <Box className="chat-input-container" position="fixed" bottom="0" left="0" right="0" p={4} bg={useThemeValue('black', 'black')} borderTopWidth="1px" borderTopColor={useThemeValue('gray.600', 'gray.600')} zIndex="10" mb="0">
      <Flex
        w="100%"
        maxW="1200px"
        mx="auto"
        boxShadow="md"
        borderRadius="lg"
        bg={inputBg}
        _hover={{ bg: inputHoverBg }}
        transition="all 0.2s"
        position="relative"
      >
        <Textarea
          ref={inputRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          variant="outline"
          px={4}
          py={2}
          minH="40px"
          maxH="200px"
          resize="none"
          overflow="auto"
          border="none"
          borderRadius="lg"
          w="100%"
          disabled={isLoading}
          _focus={{
            boxShadow: "none",
            borderColor: "transparent"
          }}
          className="auto-resize-textarea"
        />
        
        <Box className="send-button-container" position="absolute" right="8px" bottom="8px">
          <IconButton
            aria-label="Send message"
            colorScheme="brand"
            borderRadius="lg"
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            zIndex="2"
          >
            {isLoading ? <Spinner size="sm" /> : <FaPaperPlane />}
          </IconButton>
        </Box>
      </Flex>
    </Box>
  );
};

export default ChatInput;
