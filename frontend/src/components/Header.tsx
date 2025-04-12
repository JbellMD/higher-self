import React from 'react';
import {
  Flex,
  Heading,
  IconButton,
  useColorMode,
  useColorModeValue,
  Box,
} from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      p={4}
      bg={bgColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex align="center">
        <MotionBox
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
          mr={3}
          display="inline-block"
        >
          <Box
            as="span"
            fontSize="2xl"
            role="img"
            aria-label="Logo"
          >
            ✨
          </Box>
        </MotionBox>
        <Heading size="md">Higher Self</Heading>
      </Flex>
      
      <IconButton
        aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
        icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
        onClick={toggleColorMode}
        variant="ghost"
      />
    </Flex>
  );
};

export default Header;
