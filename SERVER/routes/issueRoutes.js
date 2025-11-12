const express = require("express");
const { authAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

const {
  testRoute,
  createIssue,
  updateIssue,
  updateIssueStatus,
  getMyIssues,
  getAllIssues,
} = require("../controllers/issueController");

// בדיקה בסיסית
router.get("/", testRoute);

// דיווח תקלה חדש
router.post("/", createIssue);

// עדכון כללי של תקלה
router.put("/update/:id", updateIssue);

// עדכון סטטוס תקלה (רק מנהל)
router.put("/updateStatus/:id", authAdmin, updateIssueStatus);

// קבלת התקלות של המשתמש המחובר
router.get("/myIssues", getMyIssues);

// רשימת כל התקלות (ועד)
router.get("/list", getAllIssues);

module.exports = router;
