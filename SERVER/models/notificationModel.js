const mongoose = require("mongoose");
const Joi = require("joi");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    type: {
      type: String,
      enum: ["payment", "issue", "notice", "room"],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

exports.NotificationModel = mongoose.model("notifications", notificationSchema);

// ולידציה להוספת התראה
exports.validNotification = (bodyData) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    type: Joi.string().valid("payment", "issue", "notice", "room").required(),
    message: Joi.string().min(2).max(300).required(),
    isRead: Joi.boolean().optional(),
  });
  return schema.validate(bodyData);
};
