const express = require("express");
const { auth, authAdmin } = require("../middleware/authMiddleware");
const usersController = require("../controllers/userController");

const router = express.Router();

router.get("/", usersController.testRoute);

router.post("/register", authAdmin, usersController.registerUser);

router.post("/login", usersController.loginUser);

router.get("/list", authAdmin, usersController.getUsersList);

router.get("/myInfo", auth, usersController.getMyInfo);

router.put("/update/:id", authAdmin, usersController.updateUserById);

router.delete("/:id", authAdmin, usersController.deleteUserById);

router.patch("/toggleActive/:id", authAdmin, usersController.toggleActiveStatus);

router.post("/google-login", usersController.googleLogin);

module.exports = router;
