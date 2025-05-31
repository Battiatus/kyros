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
  messageLoading: false,
};

// Thunk pour récupérer les conversations
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/conversations');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des conversations'
      );
    }
  }
);

// Thunk pour récupérer une conversation
export const fetchConversation = createAsyncThunk(
  'chat/fetchConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération de la conversation'
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
      return {
        conversationId,
        messages: response.data.data
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des messages'
      );
    }
  }
);

// Thunk pour envoyer un message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, content, type = 'texte' }, { rejectWithValue }) => {
    try {
      const response = await api.post('/messages', {
        conversation_id: conversationId,
        contenu: content,
        type
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'envoi du message'
      );
    }
  }
);

// Thunk pour créer une nouvelle conversation
export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async ({ candidatId, recruteurId, offreId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/conversations', {
        candidat_id: candidatId,
        recruteur_id: recruteurId,
        offre_id: offreId
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la création de la conversation'
      );
    }
  }
);

// Thunk pour marquer un message comme lu
export const markMessageAsRead = createAsyncThunk(
  'chat/markMessageAsRead',
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/messages/${messageId}/read`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors du marquage du message comme lu'
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
      // Ajouter un message local (avant la confirmation du serveur)
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
      
      // Fetch Conversation
      .addCase(fetchConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.messageLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messageLoading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload;
      })
      
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.messageLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messageLoading = false;
        // Remplacer le message local par la version du serveur
        const messageIndex = state.messages.findIndex(m => 
          m.tempId === action.meta.arg.tempId
        );
        
        if (messageIndex !== -1) {
          state.messages[messageIndex] = action.payload;
        } else {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.messageLoading = false;
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
        state.conversations.push(action.payload);
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark Message as Read
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        // Mettre à jour le statut de lecture du message
        const messageIndex = state.messages.findIndex(m => m.id === action.payload.id);
        if (messageIndex !== -1) {
          state.messages[messageIndex].lu = true;
          state.messages[messageIndex].date_lecture = action.payload.date_lecture;
        }
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
export const selectMessageLoading = (state) => state.chat.messageLoading;
export const selectChatError = (state) => state.chat.error;

export default chatSlice.reducer;