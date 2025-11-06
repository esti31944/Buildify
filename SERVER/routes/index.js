const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Building Management API is running" });
});

module.exports = router;
