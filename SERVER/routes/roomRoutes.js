const express = require("express");
const { RoomModel, validRoom } = require("../models/roomModel");
const router = express.Router();
const { authAdmin,auth } = require("../middleware/authMiddleware"); 

// יצירת חדר חדש (רק למנהל)
router.post("/", authAdmin, async (req, res) => {
    if (req.user.role !== "admin") // כאן תיקון
      return res.status(403).json({ msg: "Access denied" });
  
    const validBody = validRoom(req.body);
    if (validBody.error) return res.status(400).json(validBody.error.details);
  
    try {
      const room = new RoomModel(req.body);
      await room.save();
      res.status(201).json(room);
    } catch (err) {
      res.status(500).json({ msg: "Server error", err });
    }
  });
  
// שליפת כל החדרים
router.get("/list",auth, async (req, res) => {
  try {
    const rooms = await RoomModel.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// עדכון חדר
router.put("/:id", authAdmin, async (req, res) => {
    const validBody = validRoom(req.body);
    if (validBody.error) return res.status(400).json(validBody.error.details);
  
    try {
      const updatedRoom = await RoomModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedRoom) return res.status(404).json({ msg: "Room not found" });
      res.json(updatedRoom);
    } catch (err) {
      res.status(500).json({ msg: "Server error", err });
    }
  });
  

// מחיקת חדר
router.delete("/:id", authAdmin, async (req, res) => {
    try {
      const deletedRoom = await RoomModel.findByIdAndDelete(req.params.id);
      if (!deletedRoom) return res.status(404).json({ msg: "Room not found" });
      res.json({ msg: "Room deleted successfully", deletedRoom });
    } catch (err) {
      res.status(500).json({ msg: "Server error", err });
    }
  });
  

module.exports = router;