const { PaymentModel, validPayment, validPaymentUpdate } = require("../models/paymentModel");
// controllers/paymentController.js
const { NotificationModel } = require("../models/notificationModel");
const { UserModel } = require("../models/usersModel");

const dotenv = require("dotenv");
dotenv.config();

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// רשימת כל התשלומים מסוג 'monthly' (ועד)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentModel.find({ type: "monthly" }).populate("userId", "fullName").sort({ dueDate: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// התשלומים של המשתמש המחובר
exports.getMyPayments = async (req, res) => {
  const userId = req.user._id;


  try {
    const payments = await PaymentModel.find({ userId }).sort({ dueDate: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// יצירת תשלום חדש
exports.createPayment = async (req, res) => {
  const validBody = validPayment(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    const payment = new PaymentModel(req.body);
    await payment.save();

    await NotificationModel.create({
      userId: payment.userId,
      type: "payment",
      message: `נוסף לך חוב תשלום חדש: '${payment.title}'`,
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// עדכון תשלום
exports.updatePayment = async (req, res) => {
  const validBody = validPaymentUpdate(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    console.log("Updating payment:", req.params.id, req.body);

    const payment = await PaymentModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body.updatedData, updatedAt: Date.now() },
      { new: true }

    );
    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.updatePaymentStatus = async (req, res) => {

  try {
    const payment = await PaymentModel.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    const userId = req.user._id;
    const userRole = req.user.role;

    const { status } = req.body;
    const validStatuses = ["unpaid", "pending", "paid"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    if (status === "pending" && payment.userId.toString() !== userId) {
      return res.status(403).json({ msg: "Only the owner can set status to pending" });
    }

    if (status === "paid" && userRole !== "admin") {
      return res.status(403).json({ msg: "Only admin can set status to paid" });
    }

    const currentIndex = validStatuses.indexOf(payment.status);
    const newIndex = validStatuses.indexOf(status);

    if (newIndex < currentIndex) {
      return res.status(400).json({ msg: "Cannot revert status backwards" });
    }

    payment.status = status;
    payment.paymentDate = Date.now();

    await payment.save();

    let notificationMessage = "";
    if (status === "pending") {
      notificationMessage = `התשלום '${payment.title}' הועבר לאישור`;
    } else if (status === "paid") {
      notificationMessage = `התשלום '${payment.title}' אושר ושולם`;
    }

    if (notificationMessage) {
      await NotificationModel.create({
        userId: payment.userId,
        type: "payment",
        message: notificationMessage,
      });
    }

    if (status === "pending") {
      const admins = await UserModel.find({ role: "admin", isActive: true });
      const payingUser = await UserModel.findById(req.user._id);

      if (admins.length > 0) {
        const notifications = admins.map(admin => ({
          userId: admin._id,
          type: "payment",
          message: `${payingUser.fullName} העביר את תשלום '${payment.title}' וממתין לאישור`,
          isRead: false
        }));

        await NotificationModel.insertMany(notifications);
      }
    }

    res.json({
      msg: `Payment status updated to ${payment.status}`,
      payment
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const payment = await PaymentModel.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "payments" },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "שגיאה בהעלאה ל־Cloudinary" });
        }

        // שימי לב – מומלץ לשנות את שם השדה במודל
        payment.filePath = result.secure_url;
        payment.updatedAt = Date.now();

        await payment.save();

        res.json({ payment });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בהעלאת הקובץ" });
  }
};



// מחיקת תשלום
exports.deletePayment = async (req, res) => {
  try {
    const payment = await PaymentModel.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }
    res.json({ msg: "Payment deleted successfully", payment });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};
