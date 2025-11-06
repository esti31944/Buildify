const express = require("express");
const { ReservationModel, validReservation } = require("../models/reservationModel");
// const { auth } = require("../middlewares/auth");
const router = express.Router();

// יצירת הזמנה
router.post("/", async (req, res) => {
  const validBody = validReservation(req.body);
  if (validBody.error) return res.status(400).json(validBody.error.details);

  try {
    const reservation = new ReservationModel(req.body);
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// שליפת הזמנות (משתמש רואה רק שלו, ועד רואה הכול)
router.get("/list", async (req, res) => {
  try {
    const filter = req.tokenData.role === "admin" ? {} : { userId: req.tokenData._id };
    const data = await ReservationModel.find(filter)
      .populate("userId", "fullName")
      .populate("roomId", "name");
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// מחיקת הזמנה
router.delete("/:id", async (req, res) => {
  try {
    const data = await ReservationModel.deleteOne({ _id: req.params.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

module.exports = router;
