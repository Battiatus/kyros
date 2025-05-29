/**
 * Slice Redux pour le chat
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { toast } from 'react-toastify';

// État initial
const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,
};

// Thunk pour récupérer les conversations
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/conversations');
      return response.data.data.conversations;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Erreur lors de la récupération des conversations'
      );
    }
  }
);

// Thunk pour récupérer une conversation par ID
export const fetchConversationById = createAsyncThunk(
  'chat/fetchConversationById',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      return response.data.data.conversation;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Erreur lors de la récupération de la conversation'
      );
    }
  }
);

// Thunk pour récupérer les messages d'une conversation
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      return response.data.data.messages;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Erreur lors de la récupération des messages'
      );
    }
  }
);

// Thunk pour envoyer un message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post('/messages', { conversation_id: conversationId, content });
      return response.data.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Erreur lors de l\'envoi du message'
      );
    }
  }
);

// Thunk pour créer une nouvelle conversation
export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async ({ candidat_id, offre_id }, { rejectWithValue }) => {
    try {
      const response = await api.post('/conversations', { candidat_id, offre_id });
      return response.data.data.conversation;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Erreur lors de la création de la conversation'
      );
    }
  }
);

// Thunk pour marquer les messages comme lus
export const markMessagesAsRead = createAsyncThunk(
  'chat/markMessagesAsRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/conversations/${conversationId}/read`);
      return response.data.data.conversation;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Erreur lors du marquage des messages comme lus'
      );
    }
  }
);

// Slice chat
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
      state.messages = [];
    },
    clearChatError: (state) => {
      state.error = null;
    },
    addLocalMessage: (state, action) => {
      // Pour ajouter instantanément un message local avant confirmation du serveur
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Conversation By Id
      .addCase(fetchConversationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
        
        // Mettre à jour le dernier message dans la conversation
        if (state.currentConversation) {
          state.currentConversation.lastMessage = action.payload;
        }
        
        // Mettre à jour la liste des conversations
        state.conversations = state.conversations.map((conversation) => {
          if (conversation.id === action.payload.conversation_id) {
            return {
              ...conversation,
              lastMessage: action.payload
            };
          }
          return conversation;
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Conversation
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
        state.conversations = [action.payload, ...state.conversations];
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark Messages As Read
      .addCase(markMessagesAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
        
        // Mettre à jour tous les messages non lus
        state.messages = state.messages.map(message => ({
          ...message,
          lu: true,
          date_lecture: new Date().toISOString()
        }));
        
        // Mettre à jour la liste des conversations
        state.conversations = state.conversations.map((conversation) => {
          if (conversation.id === action.payload.id) {
            return {
              ...conversation,
              unreadCount: 0
            };
          }
          return conversation;
        });
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export des actions
export const { clearCurrentConversation, clearChatError, addLocalMessage } = chatSlice.actions;

// Export des selectors
export const selectAllConversations = (state) => state.chat.conversations;
export const selectCurrentConversation = (state) => state.chat.currentConversation;
export const selectMessages = (state) => state.chat.messages;
export const selectChatLoading = (state) => state.chat.loading;
export const selectChatError = (state) => state.chat.error;

export default chatSlice.reducer;