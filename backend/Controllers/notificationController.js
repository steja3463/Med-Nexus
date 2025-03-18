const NotificationModel = require("../Models/NotificationModel");

const getNotifications = async (req,res) => {
    try {
        const userId = req.user._id;
        const notifications = await NotificationModel.find({userId,markAsRead : false})
        return res.status(200).json({notifications});
    } catch (error) {
        return res.status(400).json(error);
    }
}

const markNotificationAsRead = async (req, res) => {
    try {
      const notificationId = req.params.id;
      const notification = await NotificationModel.findById(notificationId);
  
      if (!notification) return res.status(404).json({ message: 'Notification not found' });
  
      notification.markAsRead = true;
      await notification.save();
  
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  module.exports = {getNotifications,markNotificationAsRead};