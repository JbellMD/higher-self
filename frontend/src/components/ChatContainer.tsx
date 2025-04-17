import React, { useEffect, useRef } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import { useChat } from '../contexts/ChatContext';
import { useThemeValue } from '../hooks/useThemeValue';

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
  const bgColor = useThemeValue('gray.50', 'gray.900');
  
  // Empty state when no messages
  const EmptyState = () => (
    <Flex
      direction="column"
      align="center"
      justify="flex-start"
      h="100%"
      p={8}
      pt={16}
      textAlign="center"
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6} textShadow="0 0 10px rgba(0, 100, 255, 0.5)">
          The Always Laughing Smile
        </Text>
        <Flex direction="column" gap={4} mt={8}>
          <Text fontSize="md" p={2} borderRadius="md" _hover={{ bg: useThemeValue('gray.100', 'gray.700') }}>
            Tell me something that will make me smile today
          </Text>
          <Text fontSize="md" p={2} borderRadius="md" _hover={{ bg: useThemeValue('gray.100', 'gray.700') }}>
            How can I spread more joy in my life?
          </Text>
          <Text fontSize="md" p={2} borderRadius="md" _hover={{ bg: useThemeValue('gray.100', 'gray.700') }}>
            Share a funny story with me
          </Text>
          <Text fontSize="md" p={2} borderRadius="md" _hover={{ bg: useThemeValue('gray.100', 'gray.700') }}>
            What's a good way to brighten someone's day?
          </Text>
        </Flex>
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
        bg={useThemeValue('gray.100', 'gray.700')}
        color={useThemeValue('gray.800', 'white')}
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
            className="pulse-dot"
          />
          <Box
            as="span"
            h="8px"
            w="8px"
            borderRadius="50%"
            bg="brand.500"
            mr={1}
            animation="pulse 1.5s infinite 0.2s"
            className="pulse-dot"
          />
          <Box
            as="span"
            h="8px"
            w="8px"
            borderRadius="50%"
            bg="brand.500"
            animation="pulse 1.5s infinite 0.4s"
            className="pulse-dot"
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
      h="calc(100vh - 180px)"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: `${useThemeValue('gray.300', 'gray.600')} ${useThemeValue('gray.100', 'gray.800')}`
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
