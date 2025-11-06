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
const router = express.Router();

// בדיקה בסיסית
router.get("/", (req, res) => {
  res.json({ msg: "Users route works" });
});

// הוספת משתמש חדש (הרשמה)
router.post("/", async (req, res) => {
  const validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
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
router.get("/list", async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

module.exports = router;
