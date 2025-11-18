const { NotificationModel, validNotification } = require("../models/notificationModel");

// קבלת כל ההתראות למנהל (כל המשתמשים)
exports.getAllNotifications = async (req, res) => {
  try {
    const data = await NotificationModel.find()
      .populate("userId", "fullName email apartmentNumber")
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// קבלת ההתראות של המשתמש המחובר
exports.getMyNotifications = async (req, res) => {
  try {
    const data = await NotificationModel.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// יצירת התראה חדשה (למנהל בלבד)
exports.createNotification = async (req, res) => {
  const validBody = validNotification(req.body);
  if (validBody.error) return res.status(400).json(validBody.error.details);

  try {
    const notification = new NotificationModel(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// סימון התראה כנקראה
exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await NotificationModel.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    if (req.user.role === "admin" && notification.userId.toString() !== req.user._id) {
      return res.status(403).json({ msg: "Admins cannot mark others' notifications as read" });
    }

    if (req.user.role !== "admin" && notification.userId.toString() !== req.user._id) {
      return res.status(403).json({ msg: "Access denied - not your notification" });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ msg: "Server error", err: err.message });
  }
};

// מחיקת התראה (למנהל בלבד)
exports.deleteNotification = async (req, res) => {
  try {
    const result = await NotificationModel.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ msg: "Notification not found" });
    res.json({ msg: "Notification deleted", result });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};
