const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const reservationsController = require("../controllers/reservationController");

const router = express.Router();

router.post("/", auth, reservationsController.createReservation);

router.get("/list", auth, reservationsController.getReservationsList);

router.delete("/:id", auth, reservationsController.deleteReservation);

router.put("/:id", auth, reservationsController.updateReservation);

module.exports = router;
