import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Message } from '../contexts/ChatContext';
import { useThemeValue } from '../hooks/useThemeValue';

// Define props interface
interface ChatMessageProps {
  message: Message;
}

const MotionBox = motion(Box);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, content, timestamp } = message;
  
  // Set colors based on role and theme
  const isUser = role === 'user';
  const bgColor = useThemeValue(
    isUser ? 'blue.500' : 'gray.100',
    isUser ? 'blue.700' : 'gray.700'
  );
  const textColor = useThemeValue(
    isUser ? 'white' : 'gray.800',
    isUser ? 'white' : 'white'
  );
  
  // Format timestamp
  const formattedTime = format(new Date(timestamp), 'h:mm a');
  
  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <Flex
      direction="column"
      align={isUser ? 'flex-end' : 'flex-start'}
      mb={4}
      w="100%"
    >
      <Flex align="center" mb={1}>
        <Text fontSize="sm" color="gray.500" order={isUser ? 1 : 2}>
          {isUser ? 'You' : 'Higher Self'} • {formattedTime}
        </Text>
      </Flex>
      
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 0.3 }}
        maxW={{ base: '90%', md: '70%' }}
        bg={bgColor}
        color={textColor}
        p={3}
        borderRadius="lg"
        boxShadow="md"
      >
        <Text whiteSpace="pre-wrap">{content}</Text>
      </MotionBox>
    </Flex>
  );
};

export default ChatMessage;
