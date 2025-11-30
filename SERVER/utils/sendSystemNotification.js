// utils/sendSystemNotification.js
const NotificationModel = require("../models/notificationModel");

async function sendSystemNotification(userId, type, message) {
  try {
    await NotificationModel.create({
      userId,
      type,
      message,
      isRead: false,
    });
  } catch (err) {
    console.error("Error creating notification:", err);
  }
}

module.exports = sendSystemNotification;
