const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, required: true, unique: true },
    password: String,
    apartmentNumber: Number,
    phone: String,
    role: {
        type: String,
        enum: ["tenant", "admin"],
        default: "tenant"
    },
    isActive: { type: Boolean, default: true },
    ArrivalDate: {
        type: Date,
        default: Date.now
    }
});

exports.UserModel = mongoose.model("users", userSchema);

// פונקציה ליצירת טוקן JWT
exports.createToken = (user_id, role) => {
    const token = jwt.sign({ _id: user_id, role }, "secretKey123", { expiresIn: "24h" });
    return token;
};

// ולידציה להרשמה
exports.validUser = (user) => {
    const schema = Joi.object({
        fullName: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required(),
        apartmentNumber: Joi.number().min(1).required(),
        phone: Joi.string().min(9).max(15).required(),
        role: Joi.string().valid("tenant", "admin").optional(),
        isActive: Joi.boolean().optional(),
        ArrivalDate: Joi.date().optional()
    });
    return schema.validate(user);
};

// ולידציה להתחברות
exports.validLogin = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required()
    });
    return schema.validate(user);
};
