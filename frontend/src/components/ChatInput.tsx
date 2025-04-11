import React, { useState, useRef, KeyboardEvent } from 'react';
import {
  Flex,
  Input,
  IconButton,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { FaPaperPlane } from 'react-icons/fa';
import { useChat } from '../contexts/ChatContext';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isLoading } = useChat();
  
  // Colors based on color mode
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const inputHoverBg = useColorModeValue('gray.200', 'gray.600');
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      await sendMessage(message.trim());
      setMessage('');
      
      // Focus the input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  // Handle key press events (Enter to send)
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Flex
      position="sticky"
      bottom={0}
      p={4}
      bg={useColorModeValue('white', 'gray.800')}
      borderTopWidth="1px"
      borderTopColor={useColorModeValue('gray.200', 'gray.700')}
      w="100%"
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
        <Input
          ref={inputRef}
          flex={1}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="unstyled"
          px={4}
          py={3}
          disabled={isLoading}
        />
        
        <IconButton
          aria-label="Send message"
          icon={isLoading ? <Spinner size="sm" /> : <FaPaperPlane />}
          colorScheme="brand"
          borderRadius="lg"
          m={1}
          onClick={handleSendMessage}
          isDisabled={!message.trim() || isLoading}
        >
          Send
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default ChatInput;
