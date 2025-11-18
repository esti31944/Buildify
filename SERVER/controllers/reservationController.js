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
  const { error } = validReservation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { roomId, date, timeSlot } = req.body;
  const userId = req.user && req.user._id; // auth middleware must set req.user

  try {
    const room = await RoomModel.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // validate time order
    const reqFrom = hhmmToMinutes(timeSlot.from);
    const reqTo = hhmmToMinutes(timeSlot.to);
    if (reqFrom >= reqTo) return res.status(400).json({ message: "Invalid time range" });

    // check against room opening hours
    const openFrom = hhmmToMinutes(room.openingHours?.from || "00:00");
    const openTo = hhmmToMinutes(room.openingHours?.to || "23:59");
    if (reqFrom < openFrom || reqTo > openTo) {
      return res.status(400).json({ message: `Requested time outside room opening hours (${room.openingHours.from} - ${room.openingHours.to})` });
    }

    // fetch existing reservations for that room + date
    const existing = await ReservationModel.find({ roomId, date });

    for (const ex of existing) {
      const exFrom = hhmmToMinutes(ex.timeSlot.from);
      const exTo = hhmmToMinutes(ex.timeSlot.to);
      if (isOverlap(reqFrom, reqTo, exFrom, exTo)) {
        return res.status(409).json({ message: "הטווח מבוקש חופף להזמנה קיימת" });
      }
    }

    // create reservation
    const newRes = new ReservationModel({
      userId,
      roomId,
      date,
      timeSlot: { from: timeSlot.from, to: timeSlot.to }
    });

    const saved = await newRes.save();

    // push to room.reservations (optional but kept consistent)
    room.reservations = room.reservations || [];
    room.reservations.push(saved._id);
    await room.save();

    // return created reservation
    return res.status(201).json(saved);
  } catch (err) {
    console.error("createReservation error:", err);
    return res.status(500).json({ message: "Server error" });
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
    const list = await ReservationModel.find(filter).sort({ date: 1, "timeSlot.from": 1 });
    return res.json(list);
  } catch (err) {
    console.error("getReservationsList error:", err);
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
 