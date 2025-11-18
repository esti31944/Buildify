const express = require("express");
const { authAdmin,auth } = require("../middleware/authMiddleware");
const paymentsController = require("../controllers/paymentController");

const router = express.Router();
const { testRoute,getAllPayments,getMyPayments,createPayment,updatePayment,deletePayment } = require("../controllers/paymentController"   );
// GET / – רשימת כל התשלומים (רק ועד)
router.get("/", authAdmin, getAllPayments);

// GET /myPayments – התשלומים של המשתמש המחובר
router.get("/myPayments",auth, getMyPayments);

// POST / – יצירת תשלום חדש
router.post("/",auth, createPayment);

// PUT /:id – עדכון תשלום
router.put("/:id", updatePayment);

// DELETE /:id – מחיקה
router.delete("/:id", authAdmin, deletePayment);

module.exports = router;
