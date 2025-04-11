import React, { useEffect, useRef } from 'react';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import { useChat } from '../contexts/ChatContext';

const MotionBox = motion(Box);

const ChatContainer: React.FC = () => {
  const { currentSession, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);
  
  // Background color based on color mode
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // Empty state when no messages
  const EmptyState = () => (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="100%"
      p={8}
      textAlign="center"
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Welcome to Higher Self
        </Text>
        <Text color="gray.500" mb={4}>
          Your AI assistant powered by ChatGPT 4o
        </Text>
        <Text>
          Start a conversation by typing a message below.
        </Text>
      </MotionBox>
    </Flex>
  );
  
  // Loading indicator for when the AI is thinking
  const TypingIndicator = () => (
    <Flex
      align="flex-start"
      mb={4}
      w="100%"
    >
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        maxW={{ base: '90%', md: '70%' }}
        bg={useColorModeValue('gray.100', 'gray.700')}
        color={useColorModeValue('gray.800', 'white')}
        p={3}
        borderRadius="lg"
        boxShadow="md"
      >
        <Flex align="center">
          <Box
            as="span"
            h="8px"
            w="8px"
            borderRadius="50%"
            bg="brand.500"
            mr={1}
            animation="pulse 1.5s infinite"
            sx={{
              '@keyframes pulse': {
                '0%': { opacity: 0.4 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.4 },
              },
            }}
          />
          <Box
            as="span"
            h="8px"
            w="8px"
            borderRadius="50%"
            bg="brand.500"
            mr={1}
            animation="pulse 1.5s infinite 0.2s"
            sx={{
              '@keyframes pulse': {
                '0%': { opacity: 0.4 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.4 },
              },
            }}
          />
          <Box
            as="span"
            h="8px"
            w="8px"
            borderRadius="50%"
            bg="brand.500"
            animation="pulse 1.5s infinite 0.4s"
            sx={{
              '@keyframes pulse': {
                '0%': { opacity: 0.4 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.4 },
              },
            }}
          />
        </Flex>
      </MotionBox>
    </Flex>
  );
  
  return (
    <Box
      flex={1}
      p={4}
      bg={bgColor}
      overflowY="auto"
      h="calc(100vh - 140px)"
      css={{
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          width: '10px',
          background: useColorModeValue('gray.100', 'gray.800'),
        },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('gray.300', 'gray.600'),
          borderRadius: '24px',
        },
      }}
    >
      <Box maxW="1200px" mx="auto">
        {currentSession && currentSession.messages.length > 0 ? (
          <AnimatePresence>
            {currentSession.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
          </AnimatePresence>
        ) : (
          <EmptyState />
        )}
        <div ref={messagesEndRef} />
      </Box>
    </Box>
  );
};

export default ChatContainer;
