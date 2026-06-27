/**
 * Notification Helper
 * Centralized utility to create notifications on state changes.
 */
const { Notification } = require('../models');

/**
 * Create a notification for a user.
 * @param {string} userId - The target user's ID
 * @param {string} title - Notification title
 * @param {string} message - Notification body
 * @param {string} type - Notification type (e.g. 'application', 'booking', 'verification', 'job', 'review')
 */
async function createNotification(userId, title, message, type = 'general') {
  try {
    if (!userId) return null;
    const notification = await Notification.create({
      user_id: String(userId),
      title,
      message,
      type,
      read: false
    });
    return notification;
  } catch (err) {
    console.error('Failed to create notification:', err.message);
    return null;
  }
}

module.exports = { createNotification };
