const express = require("express");
const { ReservationModel, validReservation } = require("../models/reservationModel");
const { auth } = require("../middleware/authMiddleware");
const router = express.Router();

// יצירת הזמנה
router.post("/", auth, async (req, res) => {
  const validBody = validReservation(req.body);
  if (validBody.error) return res.status(400).json(validBody.error.details);

  try {
    // בונה את האובייקט עם userId שמגיע מהטוקן
    const reservationData = {
      ...req.body,
      userId: req.user._id  // <-- הוספה כאן
    };

    const reservation = new ReservationModel(reservationData);
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});


// מחיקת הזמנה
// מחיקת הזמנה (רק מנהל או המשתמש שהזמין)
router.delete("/:id", auth, async (req, res) => {
  try {
    const reservation = await ReservationModel.findById(req.params.id);
    if (!reservation) return res.status(404).json({ msg: "Reservation not found" });

    if (
      req.user.role !== "admin" &&
      reservation.userId.toString() !== req.user._id
    ) {
      return res.status(403).json({ msg: "Access denied" });
    }

    await ReservationModel.findByIdAndDelete(req.params.id);
    res.json({ msg: "Reservation deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const reservation = await ReservationModel.findById(req.params.id);
    if (!reservation) return res.status(404).json({ msg: "Reservation not found" });

    if (
      req.user.role !== "admin" &&
      reservation.userId.toString() !== req.user._id
    ) {
      return res.status(403).json({ msg: "Access denied" });
    }

    // כאן אפשר לעדכן רק את השדות המותרים
    const updateData = {
      roomId: req.body.roomId,
      date: req.body.date,
      timeSlot: req.body.timeSlot
    };

    const updatedReservation = await ReservationModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedReservation);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

module.exports = router;