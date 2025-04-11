import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Flex,
  IconButton,
  Button,
  Input,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useChat, ChatSession } from '../contexts/ChatContext';

const MotionBox = motion(Box);

const Sidebar: React.FC = () => {
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    selectSession, 
    deleteSession,
    renameSession 
  } = useChat();
  
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  
  // Colors based on color mode
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const activeBgColor = useColorModeValue('gray.200', 'gray.600');
  
  // Handle session selection
  const handleSelectSession = (sessionId: string) => {
    selectSession(sessionId);
  };
  
  // Start editing a session title
  const handleStartEditing = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setNewTitle(session.title);
  };
  
  // Save the edited session title
  const handleSaveTitle = () => {
    if (editingSessionId && newTitle.trim()) {
      renameSession(editingSessionId, newTitle.trim());
      setEditingSessionId(null);
      setNewTitle('');
    }
  };
  
  // Cancel editing
  const handleCancelEditing = () => {
    setEditingSessionId(null);
    setNewTitle('');
  };
  
  // Confirm session deletion
  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete);
      setSessionToDelete(null);
      onClose();
    }
  };
  
  // Open delete confirmation modal
  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
    onOpen();
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  return (
    <Box
      w={{ base: 'full', md: '300px' }}
      h="100vh"
      bg={bgColor}
      borderRightWidth="1px"
      borderRightColor={borderColor}
      p={4}
      position="relative"
    >
      <Flex direction="column" h="full">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold">Conversations</Text>
          <IconButton
            aria-label="New chat"
            icon={<FaPlus />}
            size="sm"
            colorScheme="brand"
            onClick={createSession}
          />
        </Flex>
        
        <VStack
          spacing={2}
          align="stretch"
          overflowY="auto"
          flex={1}
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
          {sessions.map((session) => (
            <MotionBox
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleSelectSession(session.id)}
              bg={currentSessionId === session.id ? activeBgColor : 'transparent'}
              _hover={{ bg: hoverBgColor }}
              borderRadius="md"
              p={3}
              cursor="pointer"
            >
              {editingSessionId === session.id ? (
                <Flex>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    size="sm"
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveTitle();
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Save"
                    icon={<FaEdit />}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveTitle();
                    }}
                    mr={1}
                  />
                  <IconButton
                    aria-label="Cancel"
                    icon={<FaTimes />}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelEditing();
                    }}
                  />
                </Flex>
              ) : (
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text
                      fontWeight={currentSessionId === session.id ? 'bold' : 'normal'}
                      noOfLines={1}
                    >
                      {session.title}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {formatDate(session.updatedAt)}
                    </Text>
                  </Box>
                  <Flex>
                    <IconButton
                      aria-label="Edit"
                      icon={<FaEdit />}
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditing(session);
                      }}
                      mr={1}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<FaTrash />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={(e) => handleDeleteClick(session.id, e)}
                    />
                  </Flex>
                </Flex>
              )}
            </MotionBox>
          ))}
        </VStack>
      </Flex>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Sidebar;
