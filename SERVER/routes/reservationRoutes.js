const express = require("express");
const { ReservationModel, validReservation } = require("../models/reservationModel");
const { auth } = require("../middleware/authMiddleware");
const router = express.Router();

// יצירת הזמנה
router.post("/",auth, async (req, res) => {
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

router.get("/list",auth, async (req, res) => {
  try {
    const rooms = await ReservationModel.find();
    res.json(rooms);
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

    // רק מנהל יכול למחוק הכול, או משתמש את ההזמנה שלו
    if (req.tokenData.role !== "admin" && reservation.userId.toString() !== req.tokenData._id) {
      return res.status(403).json({ msg: "Access denied" });
    }

    await ReservationModel.deleteOne({ _id: req.params.id });
    res.json({ msg: "Reservation deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", err });
  }
});


module.exports = router;
