// controllers/reservationController.js
const { ReservationModel, validReservation } = require("../models/reservationModel");
const { RoomModel } = require("../models/roomModel");

// helper: parse "HH:MM" -> minutes from midnight
function hhmmToMinutes(hhmm) {
  const [hh, mm] = hhmm.split(":").map(Number);
  return hh * 60 + mm;
}

// check overlap: a.from < b.to && a.to > b.from
function isOverlap(aFrom, aTo, bFrom, bTo) {
  return aFrom < bTo && aTo > bFrom;
}

exports.createReservation = async (req, res) => {
  const validBody = validReservation(req.body);
  if (validBody.error) return res.status(400).json(validBody.error.details);

  try {
    const { roomId, date, timeSlot } = req.body;

    const room = await RoomModel.findById(roomId);
    if (!room) return res.status(404).json({ msg: "Room not found" });

    // בדיקת שעות פתיחה
    if (timeSlot.from < room.openingHours.from || timeSlot.to > room.openingHours.to) {
      return res.status(400).json({ msg: "ההזמנה מחוץ לשעות הפעילות" });
    }

    // בדיקת התנגשות
    const exists = await ReservationModel.findOne({
      roomId,
      date,
      $or: [
        { "timeSlot.from": { $lt: timeSlot.to }, "timeSlot.to": { $gt: timeSlot.from } }
      ]
    });

    if (exists) {
      return res.status(400).json({ msg: "החדר כבר תפוס בשעות אלו" });
    }

    const reservation = new ReservationModel({
      ...req.body,
      userId: req.user._id,
    });

    await reservation.save();
    res.status(201).json(reservation);

  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};


exports.getReservationsList = async (req, res) => {
  // optional query params: roomId, date, userId
  const { roomId, date, userId } = req.query;
  const filter = {};
  if (roomId) filter.roomId = roomId;
  if (date) filter.date = date;
  if (userId) filter.userId = userId;

  try {
    const list = await ReservationModel.find(filter)
      .populate("roomId", "name")  // כאן עושים populate לשם החדר בלבד
      .sort({ date: 1, "timeSlot.from": 1 });

    return res.json(list);
  } catch (err) {
    console.error("getReservationsList error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await ReservationModel.findById(id);
    if (!reservation) return res.status(404).json({ message: "Not found" });
    return res.json(reservation);
  } catch (err) {
    console.error("getReservationById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.deleteReservation = async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await ReservationModel.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Not found" });

    // remove from room.reservations
    await RoomModel.updateOne({ _id: removed.roomId }, { $pull: { reservations: removed._id } });

    return res.json({ message: "deleted" });
  } catch (err) {
    console.error("deleteReservation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateReservation = async (req, res) => {
  // optional: implement update with same overlap checks; omitted for brevity but recommended
  return res.status(501).json({ message: "Not implemented" });
};
