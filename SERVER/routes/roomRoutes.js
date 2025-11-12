const express = require("express");
const { authAdmin, auth } = require("../middleware/authMiddleware");
const roomsController = require("../controllers/roomController");

const router = express.Router();

// יצירת חדר חדש (רק למנהל)
router.post("/", authAdmin, roomsController.createRoom);

// שליפת כל החדרים
router.get("/list", auth, roomsController.getRoomsList);

// עדכון חדר
router.put("/:id", authAdmin, roomsController.updateRoom);

// מחיקת חדר
router.delete("/:id", authAdmin, roomsController.deleteRoom);

module.exports = router;
