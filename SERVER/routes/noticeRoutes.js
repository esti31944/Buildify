const express = require("express");
const router = express.Router();
const { NoticeModel } = require("../models/noticeModel");
const { auth, authAdmin } = require("../middleware/authMiddleware");

// שליפת כל ההודעות
router.get("/list",auth, async (req, res) => {
  try {
    const rooms = await NoticeModel.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// יצירת הודעה (כל משתמש מחובר יכול)
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, category, expiresAt } = req.body;

    const newNotice = new NoticeModel({
      title,
      content,
      category,
      createdBy: req.user._id, 
      expiresAt,
    });

    const savedNotice = await newNotice.save();
    res.status(201).json(savedNotice);
  } catch (err) {
    console.error("Error creating notice:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// עדכון הודעה (מנהל או יוצר ההודעה)
router.put("/:id", auth, async (req, res) => {
  try {
    const notice = await NoticeModel.findById(req.params.id);
    if (!notice) return res.status(404).json({ msg: "Notice not found" });

    if (
      req.user.role !== "admin" &&
      notice.createdBy.toString() !== req.user._id
    ) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const updatedNotice = await NoticeModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.json(updatedNotice);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// מחיקת הודעה (מנהל או יוצר ההודעה)
router.delete("/:id", auth, async (req, res) => {
  try {
    const notice = await NoticeModel.findById(req.params.id);
    if (!notice) return res.status(404).json({ msg: "Notice not found" });

    if (
      req.user.role !== "admin" &&
      notice.createdBy.toString() !== req.user._id
    ) {
      return res.status(403).json({ msg: "Access denied" });
    }

    await NoticeModel.findByIdAndDelete(req.params.id);
    res.json({ msg: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

module.exports = router;