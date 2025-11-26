// const express = require("express");
// const { auth } = require("google-auth-library");
// const multer = require("multer");
// const path = require("path");
// const router = express.Router();

// // הגדרת תיקיית היעד לשמירת הקבצים
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // כאן נשמר הקובץ בפרויקט שלך
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // שם ייחודי
//   }
// });

// const upload = multer({ storage });

// // Route להעלאה
// router.post("/upload", upload.single("file"), (req, res) => {
//   res.json({ filePath: req.file.path }); // מחזיר נתיב הקובץ
// });



// module.exports = router;
