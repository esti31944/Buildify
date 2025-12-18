const express = require("express");
const { authAdmin,auth } = require("../middleware/authMiddleware");
const paymentsController = require("../controllers/paymentController");

const router = express.Router();
const { getAllPayments,getMyPayments,createPayment,updatePayment,uploadFile,deletePayment,updatePaymentStatus } = require("../controllers/paymentController"   );

const {uploadPayment} = require("../routes/upload");

// GET / – רשימת כל התשלומים (רק ועד)
router.get("/", authAdmin, getAllPayments);

// GET /myPayments – התשלומים של המשתמש המחובר
router.get("/myPayments",auth, getMyPayments);

// POST / – יצירת תשלום חדש
router.post("/",authAdmin, createPayment);

// PUT /:id – עדכון תשלום
router.put("/:id",authAdmin, updatePayment);

router.put("/updateStatus/:id",auth, updatePaymentStatus);

router.put("/uploadFile/:id",auth, uploadPayment.single("file"), uploadFile);

// DELETE /:id – מחיקה
router.delete("/:id", authAdmin, deletePayment);


module.exports = router;
