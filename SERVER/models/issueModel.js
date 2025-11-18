const mongoose = require("mongoose");
const Joi = require("joi");

const issueSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }, 
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    status: {
        type: String,
        enum: ["new", "in_progress", "fixed"],
        default: "new"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

exports.IssueModel = mongoose.model("issues", issueSchema);

exports.validIssue = (issue) => {
    const schema = Joi.object({
        userId: Joi.string().hex().length(24).required(),
        title: Joi.string().min(2).max(200).required(),
        description: Joi.string().min(1).max(1000).required(),
        imageUrl: Joi.string().uri().allow("", null),
        status: Joi.string().valid("new", "in_progress", "fixed")
    });
    return schema.validate(issue);
};

exports.validIssueUpdate = (issue) => {
    const schema = Joi.object({
        title: Joi.string().min(2).max(200).optional().allow(""),
        description: Joi.string().min(1).max(1000).optional().allow(""),
        imageUrl: Joi.string().uri().allow("", null).optional(),
        status: Joi.string().valid("new", "in_progress", "fixed").optional()
    });
    return schema.validate(issue);
};