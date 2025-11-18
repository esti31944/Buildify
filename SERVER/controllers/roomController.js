const { RoomModel, validRoom } = require("../models/roomModel");

// יצירת חדר חדש (רק למנהל)
exports.createRoom = async (req, res) => {
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
};

// שליפת חדר לפי ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await RoomModel.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: "Room not found" });

    res.json(room);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// שליפת כל החדרים
exports.getRoomsList = async (req, res) => {
  try {
    const rooms = await RoomModel.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// עדכון חדר
exports.updateRoom = async (req, res) => {
  const validBody = validRoom(req.body);
  if (validBody.error) return res.status(400).json(validBody.error.details);

  try {
    const updatedRoom = await RoomModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRoom) return res.status(404).json({ msg: "Room not found" });
    res.json(updatedRoom);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// מחיקת חדר
exports.deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await RoomModel.findByIdAndDelete(req.params.id);
    if (!deletedRoom) return res.status(404).json({ msg: "Room not found" });
    res.json({ msg: "Room deleted successfully", deletedRoom });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};
