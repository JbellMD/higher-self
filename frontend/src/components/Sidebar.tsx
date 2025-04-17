import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/modal';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useChat, ChatSession } from '../contexts/ChatContext';
import { useThemeValue } from '../hooks/useThemeValue';

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
  const { open, onOpen, onClose } = useDisclosure();
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  
  const bgColor = "rgba(0, 0, 0, 0.7)";
  const hoverBgColor = "rgba(20, 30, 80, 0.5)";
  const selectedBgColor = "rgba(30, 40, 100, 0.7)";
  const textColor = "white";
  const borderColor = "rgba(30, 30, 60, 0.3)";
  
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
  
  const handleCreateNewSession = () => {
    createSession();
  };
  
  return (
    <Box 
      h="100%" 
      w="100%" 
      bg={bgColor}
      backdropFilter="blur(10px)"
      borderRight="1px" 
      borderColor={borderColor}
      boxShadow="0 0 10px rgba(0, 0, 255, 0.1)"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(100, 100, 255, 0.3)',
          borderRadius: '24px',
        },
      }}
    >
      <Flex 
        direction="column" 
        h="100%" 
        p={4}
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Text 
            fontWeight="bold" 
            fontSize="lg"
            color={textColor}
            textShadow="0 0 5px rgba(0, 100, 255, 0.5)"
          >
            Conversations
          </Text>
          <IconButton
            aria-label="New conversation"
            size="sm"
            onClick={handleCreateNewSession}
            color="blue.300"
            bg="transparent"
            _hover={{ bg: hoverBgColor }}
          >
            <FaPlus />
          </IconButton>
        </Flex>
        
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          alignItems="stretch"
          overflowY="auto"
          flex={1}
        >
          {sessions.map((session) => (
            <MotionBox
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleSelectSession(session.id)}
              bg={currentSessionId === session.id ? selectedBgColor : 'transparent'}
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
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveTitle();
                    }}
                    mr={1}
                  >
                    <FaEdit />
                  </IconButton>
                  <IconButton
                    aria-label="Cancel"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelEditing();
                    }}
                  >
                    <FaTimes />
                  </IconButton>
                </Flex>
              ) : (
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text
                      fontWeight={currentSessionId === session.id ? 'bold' : 'normal'}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      color={textColor}
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
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditing(session);
                      }}
                      mr={1}
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      aria-label="Delete"
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={(e) => handleDeleteClick(session.id, e)}
                    >
                      <FaTrash />
                    </IconButton>
                  </Flex>
                </Flex>
              )}
            </MotionBox>
          ))}
        </Box>
      </Flex>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={open} onClose={onClose}>
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
