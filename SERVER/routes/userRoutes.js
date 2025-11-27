const express = require("express");
const { auth, authAdmin } = require("../middleware/authMiddleware");
const usersController = require("../controllers/userController");

const router = express.Router();

router.get("/", usersController.testRoute);

router.post("/register", authAdmin, usersController.registerUser);

router.post("/login", usersController.loginUser);

router.get("/list", authAdmin, usersController.getUsersList);
// router.get("/list/manage", authAdmin, usersController.getUsersListManage);

router.get("/myInfo", auth, usersController.getMyInfo);

router.put("/update/:id", auth, usersController.updateUserById);

router.delete("/:id", authAdmin, usersController.deleteUserById);

router.patch("/toggleActive/:id", authAdmin, usersController.toggleActiveStatus);

router.post("/google-login", usersController.googleLogin);

router.post("/checkEmail",auth, usersController.checkEmail);

// router.get("/canDelete/:id",authAdmin, usersController.canDeleteUser);

module.exports = router;
