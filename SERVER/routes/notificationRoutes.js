const express = require("express");
const { auth, authAdmin } = require("../middleware/authMiddleware");
const notificationsController = require("../controllers/notificationController");

const router = express.Router();

// קבלת כל ההתראות למנהל (כל המשתמשים)
router.get("/", authAdmin, notificationsController.getAllNotifications);

// קבלת ההתראות של המשתמש המחובר
router.get("/my", auth, notificationsController.getMyNotifications);

// יצירת התראה חדשה (למנהל בלבד)
router.post("/", authAdmin, notificationsController.createNotification);

// סימון התראה כנקראה
router.put("/read/:id", auth, notificationsController.markNotificationRead);

// מחיקת התראה (למנהל בלבד)
router.delete("/:id", authAdmin, notificationsController.deleteNotification);

module.exports = router;
