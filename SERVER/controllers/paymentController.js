const { PaymentModel, validPayment, validPaymentUpdate } = require("../models/paymentModel");

// רשימת כל התשלומים מסוג 'monthly' (ועד)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentModel.find({ type: "monthly" }).sort({ dueDate: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// התשלומים של המשתמש המחובר
exports.getMyPayments = async (req, res) => {
  const userId = req.query.userId; // אפשר לשנות ל־req.user._id אם יש Middleware שמכניס את המשתמש
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
