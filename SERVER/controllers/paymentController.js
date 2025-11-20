const { PaymentModel, validPayment, validPaymentUpdate } = require("../models/paymentModel");
// controllers/paymentController.js

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
    console.log(payments, "hello");
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
    const payment = await PaymentModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
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

    res.json({
      msg: `Payment status updated to ${payment.status}`,
      payment
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
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
