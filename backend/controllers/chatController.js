/**
 * Chat Controller (Mongoose Version)
 */
const { ChatHistory } = require('../models');
const aiService = require('../services/aiService');

const chatController = {
  sendMessage: async (req, res, next) => {
    try {
      const { text, is_voice } = req.body;

      if (!text || String(text).trim() === '') {
        return res.status(400).json({ error: 'Message text is required' });
      }

      // If user is authenticated, persist chat history
      const userId = req.user ? req.user.id : null;

      if (userId) {
        await ChatHistory.create({
          user_id: String(userId),
          text,
          sender: 'user',
          is_voice: is_voice ? 1 : 0
        });
      }

      // Get AI response
      const aiResponseText = aiService.generateAIResponse(text);

      if (userId) {
        await ChatHistory.create({
          user_id: String(userId),
          text: aiResponseText,
          sender: 'ai',
          is_voice: 0
        });
      }

      res.json({
        userMessage: { text },
        aiMessage: { text: aiResponseText }
      });
    } catch (error) {
      next(error);
    }
  },

  getHistory: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const history = await ChatHistory.find({ user_id: String(req.user.id) }).sort({ createdAt: 1 });
      
      const normalizedHistory = history.map(m => {
        const obj = m.toObject();
        obj.id = String(obj._id);
        return obj;
      });

      res.json({ history: normalizedHistory });
    } catch (error) {
      next(error);
    }
  },

  clearHistory: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const userId = req.user.id;
      await ChatHistory.deleteMany({ user_id: String(userId) });
      
      res.json({ message: 'Chat history cleared' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = chatController;
