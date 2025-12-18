const express = require("express");
const { auth } = require("google-auth-library");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const issuesPath = path.join(__dirname, "../uploads/issueIMG");
const paymentsPath = path.join(__dirname, "../uploads/paymentIMG");

if (!fs.existsSync(paymentsPath)) {
    fs.mkdirSync(paymentsPath, { recursive: true });
}

[issuesPath, paymentsPath].forEach((p) => {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

const issueStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, issuesPath),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const paymentStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, paymentsPath),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const uploadIssue = multer({ storage: issueStorage });
const uploadPayment = multer({ storage: paymentStorage });

module.exports = {
    uploadIssue,
    uploadPayment,
};
