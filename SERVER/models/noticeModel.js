const mongoose = require("mongoose");
const Joi = require("joi");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 2000,
  },
  category: {
    type: String,
    enum: ["event", "announcement"],
    default: "announcement",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
});

// יצירת המודל
const NoticeModel = mongoose.model("Notice", noticeSchema);


function validNotice(_bodyData) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    content: Joi.string().min(5).max(2000).required(),
    category: Joi.string().valid("event", "announcement").default("announcement"),
    expiresAt: Joi.date().optional(),
  });

  return schema.validate(_bodyData, { abortEarly: false });
}

module.exports = {
  NoticeModel,
  validNotice,
};