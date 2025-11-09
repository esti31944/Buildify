// פעולות עיקריות
// POST /register – רישום משתמש חדש
// POST /login – התחברות
// GET /myInfo – פרטי המשתמש המחובר
// GET /usersList – רשימת משתמשים (רק לועד)
// PUT /update/:id – עדכון פרטי משתמש
// DELETE /:id – מחיקת משתמש

const express = require("express");
const bcrypt = require("bcryptjs");
const { UserModel, validUser, validLogin, createToken } = require("../models/usersModel");
const {auth, authAdmin } = require("../middleware/authMiddleware");
const router = express.Router();
const dotenv = require("dotenv");

// בדיקה בסיסית
router.get("/", (req, res) => {
  res.json({ msg: "Users route works" });
});

// הוספת משתמש חדש (הרשמה)
router.post("/register",authAdmin, async (req, res) => {
  const validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {

    // מכאן בדיקות נוספות
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const existingActiveApartment = await UserModel.findOne({
      apartmentNumber: req.body.apartmentNumber,
      isActive: true
    });
    if (existingActiveApartment) {
      return res.status(400).json({ msg: "An active user already exists for this apartment" });
    }
    // עד כאן בדיקות נוספות

    const user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    user.password = "******";
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    res.status(500).json({ msg: "Server error", err });
  }
});

// התחברות משתמש
router.post("/login", async (req, res) => {
  const validBody = validLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ msg: "Email or password incorrect" });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(401).json({ msg: "Email or password incorrect" });

    const token = createToken(user._id, user.role);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// שליפה של כל המשתמשים (לוועד בלבד)
router.get("/list",authAdmin, async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// שליפת מידע על המשתמש המחובר
router.get("/myInfo",auth, async (req, res) => {
  try {
    // const token = req.header("x-auth-token");
    // if (!token) return res.status(401).json({ msg: "No token provided" });

    // const jwt = require("jsonwebtoken");
    // const decoded = jwt.verify(token, "secretKey123");

    // const user = await UserModel.findById(decoded._id, { password: 0 });
    const user = await UserModel.findById(req.user._id, { password: 0 });
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// עדכון משתמש לפי ID
router.put("/update/:id",authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ msg: "User not found" });

    updated.password = "******";
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// מחיקת משתמש לפי ID
router.delete("/:id",authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// שינוי סטטוס משתמש (פעיל / לא פעיל)
router.patch("/toggleActive/:id",authAdmin, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ msg: `User is now ${user.isActive ? "active" : "inactive"}` });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});


module.exports = router;
