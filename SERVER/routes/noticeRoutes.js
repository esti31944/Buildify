const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const noticesController = require("../controllers/noticeController");

const router = express.Router();

// שליפת כל ההודעות
router.get("/list", auth, noticesController.getAllNotices);

// יצירת הודעה (כל משתמש מחובר יכול)
router.post("/", auth, noticesController.createNotice);

// עדכון הודעה (מנהל או יוצר ההודעה)
router.put("/:id", auth, noticesController.updateNotice);

// מחיקת הודעה (מנהל או יוצר ההודעה)
router.delete("/:id", auth, noticesController.deleteNotice);

module.exports = router;
