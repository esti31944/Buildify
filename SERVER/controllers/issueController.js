const { IssueModel, validIssue, validIssueUpdate } = require("../models/issueModel");
const { authAdmin } = require("../middleware/authMiddleware");

// בדיקה בסיסית
const testRoute = (req, res) => {
  res.json({ msg: "Issues route works" });
};

// דיווח תקלה חדש
const createIssue = async (req, res) => {
  const issueData = { ...req.body, userId: req.user._id };
  const validBody = validIssue(issueData);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    const issue = new IssueModel(issueData);
    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// עדכון כללי של תקלה
const updateIssue = async (req, res) => {
  const validBody = validIssueUpdate(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    const issue = await IssueModel.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ msg: "Issue not found" });
    }

    if (issue.userId.toString() !== req.user._id) {
      return res.status(403).json({ msg: "You are not allowed to update this issue" });
    }

    const updatedIssue = await IssueModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    res.json(updatedIssue);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// עדכון סטטוס תקלה (רק מנהל)
const updateIssueStatus = async (req, res) => {
  try {
    const issue = await IssueModel.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: "Issue not found" });

    const statuses = ["new", "in_progress", "fixed"];
    const currentIndex = statuses.indexOf(issue.status);

    if (currentIndex === statuses.length - 1) {
      return res.status(400).json({ msg: "Issue is already fixed, cannot update status further" });
    }

    const nextStatus = statuses[currentIndex + 1];
    issue.status = nextStatus;
    issue.updatedAt = Date.now();
    await issue.save();

    res.json({ msg: `Issue status updated to ${issue.status}`, issue });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// קבלת התקלות של המשתמש המחובר
const getMyIssues = async (req, res) => {
  const userId = req.user._id;
  try {
    const issues = await IssueModel.find({ userId }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

// רשימת כל התקלות (ועד)
const getAllIssues = async (req, res) => {
  try {
    const issues = await IssueModel.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

module.exports = {
  testRoute,
  createIssue,
  updateIssue,
  updateIssueStatus,
  getMyIssues,
  getAllIssues,
};
