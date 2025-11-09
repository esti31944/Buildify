const mongoose = require("mongoose");
const Joi = require("joi");

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    openingHours: {
        from: { type: String, default: "08:00" },
        to: { type: String, default: "22:00" }
    },
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: "reservations" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

exports.RoomModel = mongoose.model("rooms", roomSchema);

exports.validRoom = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().allow("", null),
        openingHours: Joi.object({
            from: Joi.string().pattern(/^\d{2}:\d{2}$/),
            to: Joi.string().pattern(/^\d{2}:\d{2}$/)
        })
    });
    return schema.validate(body);
};
