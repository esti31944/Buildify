const mongoose = require("mongoose");
const Joi = require("joi");

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    type: { 
        type: String, 
        enum: ["monthly", "extra"], 
        default: "monthly" 
    },
    month: { type: String, trim: true }, // לדוגמה: "2025-10"
    title: { type: String, required: true, trim: true }, // לדוגמה: "ועד חודשי"
    amount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["paid", "unpaid", "late"], 
        default: "unpaid" 
    },
    paymentMethod: { 
        type: String, 
        enum: ["bank", "cash", "credit"], 
        default: "bank" 
    },
    dueDate: { type: Date, required: true },
    paymentDate: { type: Date }, // אם שולם
    notes: { type: String, trim: true, default: "" }
}, { timestamps: true });

exports.PaymentModel = mongoose.model("payments", paymentSchema);

exports.validPayment = (payment) => {
    const schema = Joi.object({
        userId: Joi.string().hex().length(24).required(),
        type: Joi.string().valid("monthly", "extra"),
        month: Joi.string().allow("", null),
        title: Joi.string().min(2).max(200).required(),
        amount: Joi.number().positive().required(),
        status: Joi.string().valid("paid", "unpaid", "late"),
        paymentMethod: Joi.string().valid("bank", "cash", "credit"),
        dueDate: Joi.date().required(),
        paymentDate: Joi.date().allow(null),
        notes: Joi.string().max(1000).allow("", null)
    });
    return schema.validate(payment);
};

exports.validPaymentUpdate = (payment) => {
    const schema = Joi.object({
        type: Joi.string().valid("monthly", "extra"),
        month: Joi.string().allow("", null),
        title: Joi.string().min(2).max(200),
        amount: Joi.number().positive(),
        status: Joi.string().valid("paid", "unpaid", "late"),
        paymentMethod: Joi.string().valid("bank", "cash", "credit"),
        dueDate: Joi.date(),
        paymentDate: Joi.date().allow(null),
        notes: Joi.string().max(1000).allow("", null)
    });
    return schema.validate(payment);
};
