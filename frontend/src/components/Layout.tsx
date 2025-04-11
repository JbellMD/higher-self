import React from 'react';
import { Flex, Box, useDisclosure, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';

const Layout: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  return (
    <Flex h="100vh" direction="column">
      <Header />
      
      <Flex flex={1} overflow="hidden">
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <IconButton
            aria-label="Open sidebar"
            icon={<FaBars />}
            position="fixed"
            top="70px"
            left="10px"
            zIndex={2}
            colorScheme="brand"
            onClick={onOpen}
            display={{ base: 'flex', md: 'none' }}
          />
        )}
        
        {/* Sidebar - hidden on mobile unless opened */}
        <Box
          display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
          position={{ base: 'fixed', md: 'relative' }}
          top={{ base: 0, md: 'auto' }}
          left={{ base: 0, md: 'auto' }}
          zIndex={{ base: 15, md: 'auto' }}
          h="100vh"
          w={{ base: 'full', md: '300px' }}
          onClick={isMobile ? onClose : undefined}
        >
          <Sidebar />
        </Box>
        
        {/* Main chat area */}
        <Flex
          direction="column"
          flex={1}
          w={{ base: 'full', md: 'calc(100% - 300px)' }}
        >
          <ChatContainer />
          <ChatInput />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Layout;
