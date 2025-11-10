// GET / – רשימת כל התשלומים (רק ועד)
// GET /myPayments – התשלומים של המשתמש המחובר
// POST / – יצירת תשלום חדש
// PUT /:id – עדכון תשלום
// DELETE /:id – מחיקה
const express = require("express");
const { authAdmin } = require("../middleware/authMiddleware");
const { PaymentModel, validPayment, validPaymentUpdate } = require("../models/paymentModel");
const router = express.Router();

// בדיקה בסיסית
router.get("/", authAdmin, async (req, res) => {
  try {
    // רשימת כל התשלומים מסוג 'monthly' (ועד)
    const payments = await PaymentModel.find({ type: "monthly" }).sort({ dueDate: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// GET /myPayments – התשלומים של המשתמש המחובר
router.get("/myPayments", async (req, res) => {
  const userId = req.query.userId; // אפשר לשנות ל־req.user._id אם יש Middleware שמכניס את המשתמש
  try {
    const payments = await PaymentModel.find({ userId }).sort({ dueDate: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// POST / – יצירת תשלום חדש
router.post("/", async (req, res) => {
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
});

// PUT /:id – עדכון תשלום
router.put("/:id", async (req, res) => {
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
});

// DELETE /:id – מחיקה
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    const payment = await PaymentModel.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }
    res.json({ msg: "Payment deleted successfully", payment });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

module.exports = router;
