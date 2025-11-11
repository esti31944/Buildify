const express = require("express");
const { authAdmin } = require("../middleware/authMiddleware");
const paymentsController = require("../controllers/paymentController");

const router = express.Router();

// GET / – רשימת כל התשלומים (רק ועד)
router.get("/", authAdmin, paymentsController.getAllPayments);

// GET /myPayments – התשלומים של המשתמש המחובר
router.get("/myPayments", paymentsController.getMyPayments);

// POST / – יצירת תשלום חדש
router.post("/", paymentsController.createPayment);

// PUT /:id – עדכון תשלום
router.put("/:id", paymentsController.updatePayment);

// DELETE /:id – מחיקה
router.delete("/:id", authAdmin, paymentsController.deletePayment);

module.exports = router;
