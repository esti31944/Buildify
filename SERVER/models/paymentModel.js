const mongoose = require("mongoose");
const Joi = require("joi");

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    type: {
        type: String,
        enum: ["monthly", "extra"],
        default: "monthly"
    },
    month: { type: Date, default: Date.now },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["unpaid", "pending", "paid"],
        default: "unpaid"
    },
    paymentMethod: {
        type: String,
        enum: ["bank", "cash", "credit"],
        default: "bank"
    },
    filePath: { type: String, trim: true, default: "" },
    paymentDate: { type: Date }, // אם שולם
    notes: { type: String, trim: true, default: "" }
}, { timestamps: true });

exports.PaymentModel = mongoose.model("payments", paymentSchema);

// --- VALIDATION --- //

exports.validPayment = (payment) => {
    const schema = Joi.object({
        userId: Joi.string().hex().length(24).required(),
        type: Joi.string().valid("monthly", "extra"),
        month: Joi.date().allow(null),
        title: Joi.string().min(2).max(200).required(),
        amount: Joi.number().positive().required(),
        status: Joi.string().valid("paid", "unpaid", "pending"),
        paymentMethod: Joi.string().valid("bank", "cash", "credit"),
        paymentDate: Joi.date().allow(null),
        notes: Joi.string().max(1000).allow("", null)

    });
    return schema.validate(payment);
};

exports.validPaymentUpdate = (payment) => {
    const schema = Joi.object({
        type: Joi.string().valid("monthly", "extra"),
        month: Joi.date().allow(null),
        title: Joi.string().min(2).max(200),
        amount: Joi.number().positive(),
        status: Joi.string().valid("paid", "unpaid", "pending"),
        paymentMethod: Joi.string().valid("bank", "cash", "credit"),
        paymentDate: Joi.date().allow(null),
        notes: Joi.string().max(1000).allow("", null)
    });
    return schema.validate(payment);
};
