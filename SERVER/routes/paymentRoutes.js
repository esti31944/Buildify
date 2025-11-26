const express = require("express");
const { authAdmin,auth } = require("../middleware/authMiddleware");
const paymentsController = require("../controllers/paymentController");

const router = express.Router();
const { testRoute,getAllPayments,getMyPayments,createPayment,updatePayment,uploadFile,deletePayment,updatePaymentStatus } = require("../controllers/paymentController"   );

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET / – רשימת כל התשלומים (רק ועד)
router.get("/", authAdmin, getAllPayments);

// GET /myPayments – התשלומים של המשתמש המחובר
router.get("/myPayments",auth, getMyPayments);

// POST / – יצירת תשלום חדש
router.post("/",authAdmin, createPayment);

// PUT /:id – עדכון תשלום
router.put("/:id",authAdmin, updatePayment);

router.put("/updateStatus/:id",auth, updatePaymentStatus);

router.put("/uploadFile/:id",auth, upload.single("file"), uploadFile);

// DELETE /:id – מחיקה
router.delete("/:id", authAdmin, deletePayment);


module.exports = router;
