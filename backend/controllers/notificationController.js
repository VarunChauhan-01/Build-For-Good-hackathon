/**
 * Notification Controller (Mongoose Version) — Phase 2
 * Full notification management with unread count and mark-all-read.
 */
const { Notification } = require('../models');

const notificationController = {
  getNotifications: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const notifications = await Notification.find({ user_id: String(req.user.id) }).sort({ createdAt: -1 }).limit(50);

      const normalizedNotifications = notifications.map(n => {
        const obj = n.toObject();
        obj.id = String(obj._id);
        return obj;
      });

      const unreadCount = await Notification.countDocuments({ user_id: String(req.user.id), read: false });

      res.json({ notifications: normalizedNotifications, unreadCount });
    } catch (error) {
      next(error);
    }
  },

  getUnreadCount: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const unreadCount = await Notification.countDocuments({ user_id: String(req.user.id), read: false });
      res.json({ unreadCount });
    } catch (error) {
      next(error);
    }
  },

  markAsRead: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const id = req.params.id;
      await Notification.findByIdAndUpdate(id, { read: true });
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  },

  markAllRead: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      await Notification.updateMany({ user_id: String(req.user.id), read: false }, { read: true });
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = notificationController;
