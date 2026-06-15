import Notification from '../modules/notification.model.js';

/**
 * Service to handle persistent and real-time notifications
 */
class NotificationService {
  async createNotification(req, { recipient, sender, type, message, link, socketEvent }) {
    try {
      // 1. Create DB Record
      await Notification.create({
        recipient,
        sender,
        type,
        message,
        link
      });

      // 2. Emit Socket Event
      const io = req.app.get("io");
      if (io) {
        io.to(`user_${recipient}`).emit("notification", {
          type: socketEvent || type,
          message,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error("Notification Service Error:", error);
    }
  }
}

export default new NotificationService();