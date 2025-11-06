// GET / – רשימת כל התקלות (ועד)
// GET /myIssues – התקלות של המשתמש המחובר
// POST / – דיווח תקלה
// PUT /updateStatus/:id – עדכון סטטוס תקלה (טופלה / ממתינה וכו’)
const { authAdmin } = require("../middleware/authMiddleware"); // ייבוא של ה-Middleware

const express = require("express");
const bcrypt = require("bcryptjs");
const { IssueModel, validIssue, validIssueUpdate } = require("../models/issueModel");
const router = express.Router();

// בדיקה בסיסית
router.get("/", (req, res) => {
  res.json({ msg: "Issues route works" });
});

router.post("/", async (req, res) => {
  const validBody = validIssue(req.body);   
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        const issue = new IssueModel(req.body);
        await issue.save();
        res.status(201).json(issue);
    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
});

router.put("/update/:id", async (req, res) => {
    const validBody = validIssueUpdate(req.body);   
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        const issue = await IssueModel.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!issue) {
            return res.status(404).json({ msg: "Issue not found" });
        }
        res.json(issue);
    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
});
router.put("/updateStatus/:id", authAdmin, async (req, res) => {
    try {
        const issue = await IssueModel.findById(req.params.id);
        if (!issue) return res.status(404).json({ msg: "Issue not found" });

        // סדר סטטוסים
        const statuses = ["new", "in_progress", "fixed"];
        const currentIndex = statuses.indexOf(issue.status);

        if (currentIndex === statuses.length - 1) {
            // אם כבר fixed, לא משנים יותר
            return res.status(400).json({ msg: "Issue is already fixed, cannot update status further" });
        }

        const nextStatus = statuses[currentIndex + 1];
        issue.status = nextStatus;
        issue.updatedAt = Date.now(); // עדכון אוטומטי
        await issue.save();

        res.json({ msg: `Issue status updated to ${issue.status}`, issue });
    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
});

router.get("/myIssues", async (req, res) => {
    const userId = req.query.userId;
    try {
        const issues = await IssueModel
            .find({ userId })
            .sort({ createdAt: -1 });
        res.json(issues);
    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
});
router.get("/list", async (req, res) => {
  try {
    const issues = await IssueModel.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

module.exports = router;

