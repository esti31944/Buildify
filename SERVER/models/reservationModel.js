const mongoose = require("mongoose");
const Joi = require("joi");

const reservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "rooms", required: true },
    date: { type: String, required: true }, // "2025-11-04"
    timeSlot: {
        from: { type: String, required: true },
        to: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

exports.ReservationModel = mongoose.model("reservations", reservationSchema);

exports.validReservation = (body) => {
    const schema = Joi.object({
        roomId: Joi.string().required(),
        date: Joi.string().required(),
        timeSlot: Joi.object({
            from: Joi.string().required(),
            to: Joi.string().required()
        }).required()
    });
    return schema.validate(body);
};