const express = require("express");
const { authAdmin, auth } = require("../middleware/authMiddleware");
const router = express.Router();

const {
  testRoute,
  createIssue,
  updateIssue,
  updateIssueStatus,
  getMyIssues,
  getAllIssues,
} = require("../controllers/issueController");
const multer = require("multer");
const path = require("path");

// הגדרת האחסון
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");  // התיקייה לשמירת הקבצים
  },
  filename: function (req, file, cb) {
    // מוודא סיומת נכונה ושם ייחודי עם זמן
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + file.originalname.replace(ext, "") + ext;
    cb(null, name);
  },
});

// סינון קבצים - רק תמונות לדוגמה
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// נניח שהשדה שה-client שולח נקרא "image" (ככה צריך להיות גם בטופס)
// הנחת העבודה היא שאתה משתמש ב-router שלך:
router.post("/", auth, upload.single("image"), createIssue);

// בדיקה בסיסית
router.get("/", testRoute);




// עדכון כללי של תקלה
router.put("/update/:id",auth, updateIssue);

// עדכון סטטוס תקלה (רק מנהל)
router.put("/updateStatus/:id", authAdmin, updateIssueStatus);

// קבלת התקלות של המשתמש המחובר
router.get("/myIssues",auth, getMyIssues);

// רשימת כל התקלות (ועד)
router.get("/list", authAdmin, getAllIssues);

module.exports = router;
