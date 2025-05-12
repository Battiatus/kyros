const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = (io) => {
  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      socket.user = {
        id: user._id,
        role: user.role,
        name: `${user.firstName} ${user.lastName}`
      };
      
      next();
    } catch (err) {
      logger.error(`Socket authentication error: ${err.message}`);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} - User: ${socket.user.id}`);
    
    // Join user's personal room
    socket.join(socket.user.id.toString());
    
    // Mark user as online
    socket.broadcast.emit('user:status', {
      userId: socket.user.id,
      status: 'online'
    });
    
    // Handle joining a conversation
    socket.on('conversation:join', async (conversationId) => {
      try {
        // Verify the user has access to this conversation
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
          return socket.emit('error', { message: 'Conversation not found' });
        }
        
        const userInConversation = 
          conversation.candidate.toString() === socket.user.id.toString() ||
          conversation.recruiter.toString() === socket.user.id.toString();
        
        if (!userInConversation) {
          return socket.emit('error', { message: 'Access denied to this conversation' });
        }
        
        // Join the conversation room
        socket.join(`conversation:${conversationId}`);
        
        // Mark messages as read
        if (conversation.candidate.toString() === socket.user.id.toString()) {
          await Message.updateMany(
            { 
              conversation: conversationId,
              sender: conversation.recruiter,
              read: false
            },
            { read: true, readAt: Date.now() }
          );
        } else {
          await Message.updateMany(
            { 
              conversation: conversationId,
              sender: conversation.candidate,
              read: false
            },
            { read: true, readAt: Date.now() }
          );
        }
        
        // Emit read receipts
        socket.to(`conversation:${conversationId}`).emit('message:read', {
          conversationId,
          reader: socket.user.id
        });
        
        logger.info(`User ${socket.user.id} joined conversation ${conversationId}`);
      } catch (err) {
        logger.error(`Error joining conversation: ${err.message}`);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });
    
    // Handle leaving a conversation
    socket.on('conversation:leave', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      logger.info(`User ${socket.user.id} left conversation ${conversationId}`);
    });
    
    // Handle sending a message
    socket.on('message:send', async (data) => {
      try {
        const { conversationId, content, type = 'text' } = data;
        
        // Verify the conversation exists
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
          return socket.emit('error', { message: 'Conversation not found' });
        }
        
        // Check if user is part of the conversation
        const userInConversation = 
          conversation.candidate.toString() === socket.user.id.toString() ||
          conversation.recruiter.toString() === socket.user.id.toString();
        
        if (!userInConversation) {
          return socket.emit('error', { message: 'Access denied to this conversation' });
        }
        
        // Create the message
        const message = await Message.create({
          conversation: conversationId,
          sender: socket.user.id,
          content,
          type,
          sentAt: Date.now(),
          read: false
        });
        
        // Update conversation's last activity
        conversation.lastActivity = Date.now();
        await conversation.save();
        
        // Broadcast the message to the conversation room
        io.to(`conversation:${conversationId}`).emit('message:new', {
          message: {
            _id: message._id,
            conversation: message.conversation,
            sender: message.sender,
            content: message.content,
            type: message.type,
            sentAt: message.sentAt,
            read: message.read
          },
          sender: {
            id: socket.user.id,
            name: socket.user.name
          }
        });
        
        // Determine the recipient
        const recipientId = 
          conversation.candidate.toString() === socket.user.id.toString()
            ? conversation.recruiter.toString()
            : conversation.candidate.toString();
        
        // Send notification to recipient if not in the conversation room
        const recipientSocketIds = io.sockets.adapter.rooms.get(recipientId);
        if (recipientSocketIds) {
          io.to(recipientId).emit('notification:message', {
            conversationId,
            message: {
              _id: message._id,
              content: message.content,
              type: message.type,
              sentAt: message.sentAt
            },
            sender: {
              id: socket.user.id,
              name: socket.user.name
            }
          });
        }
        
        logger.info(`Message sent in conversation ${conversationId} by user ${socket.user.id}`);
      } catch (err) {
        logger.error(`Error sending message: ${err.message}`);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // Handle typing indicator
    socket.on('typing:start', (conversationId) => {
      socket.to(`conversation:${conversationId}`).emit('typing:update', {
        conversationId,
        userId: socket.user.id,
        typing: true
      });
    });
    
    socket.on('typing:stop', (conversationId) => {
      socket.to(`conversation:${conversationId}`).emit('typing:update', {
        conversationId,
        userId: socket.user.id,
        typing: false
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      // Mark user as offline
      socket.broadcast.emit('user:status', {
        userId: socket.user.id,
        status: 'offline'
      });
      
      logger.info(`Socket disconnected: ${socket.id} - User: ${socket.user.id}`);
    });
  });
};