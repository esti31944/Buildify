const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    apartmentNumber: Number,
    phone: String,
    role: {
        type: String,
        default: "user" // או 'admin' לוועד הבית
    },
    // isActive: { type: Boolean, default: true },
    date_created: {
        type: Date,
        default: Date.now
    }
});
// },{ timestamps: true });

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
        phone: Joi.string().min(9).max(15).required()
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
