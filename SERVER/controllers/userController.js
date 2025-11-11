const bcrypt = require("bcryptjs");
const { UserModel, validUser, validLogin, createToken } = require("../models/usersModel");

// פונקציות קונטרולר

exports.testRoute = (req, res) => {
  res.json({ msg: "Users route works" });
};

exports.registerUser = async (req, res) => {
  const validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
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
};

exports.loginUser = async (req, res) => {
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
};

exports.getUsersList = async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.getMyInfo = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id, { password: 0 });
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.updateUserById = async (req, res) => {
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
};

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.toggleActiveStatus = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ msg: `User is now ${user.isActive ? "active" : "inactive"}` });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};
