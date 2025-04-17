import React from 'react';
import {
  Flex,
  Heading,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useThemeValue } from '../hooks/useThemeValue';

const MotionBox = motion(Box);

const Header: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      p={4}
      bg="rgba(0, 0, 0, 0.7)"
      backdropFilter="blur(10px)"
      borderBottomWidth="1px"
      borderBottomColor="rgba(30, 30, 60, 0.3)"
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow="0 0 10px rgba(0, 0, 255, 0.2)"
    >
      <Flex align="center">
        <MotionBox
          animate={{
            rotate: [0, 10, -10, 10, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          display="inline-block"
          mr={2}
        >
          <Box fontSize="xl">
            ✨
          </Box>
        </MotionBox>
        <Heading size="md" fontWeight="bold" color="white" textShadow="0 0 5px rgba(0, 100, 255, 0.7)">
          The Always Laughing Smile
        </Heading>
      </Flex>
      
      <IconButton
        aria-label={`Toggle ${isDark ? 'Light' : 'Dark'} Mode`}
        onClick={toggleTheme}
        variant="ghost"
        color="blue.300"
        _hover={{ bg: "rgba(0, 0, 100, 0.2)" }}
      >
        {isDark ? <FaSun /> : <FaMoon />}
      </IconButton>
    </Flex>
  );
};

export default Header;
