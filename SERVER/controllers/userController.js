const bcrypt = require("bcryptjs");
const { UserModel, validUser, validLogin, createToken } = require("../models/usersModel");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const { IssueModel } = require("../models/issueModel");
const { PaymentModel } = require("../models/paymentModel")
const { NoticeModel } = require("../models/noticeModel")
const { ReservationModel } = require("../models/reservationModel");
const { NotificationModel } = require("../models/notificationModel");

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

    if (req.body.role === "tenant") {
      const existingActiveApartment = await UserModel.findOne({
        apartmentNumber: req.body.apartmentNumber,
        isActive: true
      });

      if (existingActiveApartment) {
        return res.status(400).json({ msg: "An active user already exists for this apartment" });
      }
    }

    const user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    await NotificationModel.create({
      userId: user._id,
      type: "system",
      message: "Buildify מברכת אותך על הצטרפותך לשרותינו:)",
      isRead: false
    });

    await NotificationModel.create({
      userId: user._id,
      type: "system",
      message: "מומלץ להחליף סיסמה לאחר ההרשמה הראשונה",
      isRead: false
    });
    

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

    // const token = createToken(user._id, user.role);
    const token = createToken(user);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.getUsersList = async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 }).sort({ apartmentNumber: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};
// exports.getUsersListManage = async (req, res) => {
//   try {
//     const users = await UserModel.find({}, { password: 0 }).sort({ apartmentNumber: 1 });

//     const result = [];

//     for (const u of users) {
//       const hasRelations =
//         await IssueModel.exists({ userId: u._id }) ||
//         await PaymentModel.exists({ userId: u._id }) ||
//         await NoticeModel.exists({ createdBy: u._id }) ||
//         await ReservationModel.exists({ userId: u._id }) ||
//         await NotificationModel.exists({ userId: u._id }) ||
//         false;

//       result.push({
//         ...u.toObject(),
//         canDelete: !hasRelations
//       });
//     }

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ msg: "Error loading users" });
//   }
// };

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

    if (req.user.role !== "admin" && req.user._id !== id) {
      return res.status(403).json({ msg: "Permission denied" });
    }

    const data = { ...req.body };

    if (data.email) {
      const existingEmail = await UserModel.findOne({
        email: data.email,
        _id: { $ne: id } // משתמשים אחרים בלבד
      });
      if (existingEmail) {
        return res.status(400).json({ msg: "Email already exists" });
      }
    }

    if (data.apartmentNumber && req.user.role === "admin" && data.role === "tenant") {
      const conflict = await UserModel.findOne({
        _id: { $ne: id },               // כל המשתמשים פרט לזה שמעדכנים
        apartmentNumber: data.apartmentNumber,
        isActive: true
      });
      if (conflict) {
        return res.status(400).json({ msg: "An active user already exists for this apartment" });
      }
    }

    if (req.user.role === "tenant") {
      const allowedFields = ["phone", "email", "password"];
      Object.keys(data).forEach((key) => {
        if (!allowedFields.includes(key)) delete data[key];
      });
    }

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
    const hasIssues = await IssueModel.exists({ userId: id });
    const hasPayments = await PaymentModel.exists({ userId: id });
    const hasNotices = await NoticeModel.exists({ createdBy: id });
    const hasReservations = await ReservationModel.exists({ userId: id });
    const hasNotifications = await NotificationModel.exists({ userId: id });

    if (
      hasIssues || hasPayments || hasReservations || hasNotices || hasNotifications
    ) {
      return res.status(400).json({
        ok: false,
        msg: "לא ניתן למחוק דייר שמופיע ברשומות אחרות במערכת"
      });
    }
    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ ok: false, msg: "User not found" });
    return res.json({ ok: true, msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ ok: false, msg: "Server error", err });
  }
};

exports.toggleActiveStatus = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "משתמש לא רשום במערכת" });
    }

    // אם המשתמש קיים – יוצרים JWT
    // const jwtToken = createToken(user._id, user.role);
    const jwtToken = createToken(user);

    // אפשר גם לשלוח את פרטי המשתמש יחד עם הטוקן
    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      apartmentNumber: user.apartmentNumber,
      phone: user.phone,
      isActive: user.isActive,
    };

    res.json({ token: jwtToken, user: userData });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Google login failed", err });
  }
};

exports.checkEmail = async (req, res) => {
  const { email, id } = req.body;
  try {
      const existing = await UserModel.findOne({ email, _id: { $ne: id } });
      res.json({ available: !existing });
  } catch (err) {
      res.status(500).json({ available: false });
  }
};

// exports.canDeleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const hasRelations =
//       await IssueModel.exists({ userId: id }) ||
//       await PaymentModel.exists({ userId: id }) ||
//       await NoticeModel.exists({ createdBy: id }) ||
//       await ReservationModel.exists({ userId: id }) ||
//       await NotificationModel.exists({ userId: id }) ||
//       false;

//     res.json({ canDelete: !hasRelations });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", err });
//   }
// };

