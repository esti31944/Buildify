const jwt = require("jsonwebtoken");


// Middleware לאימות JWT - כל משתמש מחובר יכול לעבור
const auth = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // מכיל _id ו-role
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};

// Middleware לאימות JWT והרשאות מנהל בלבד
const authAdmin = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") return res.status(403).json({ msg: "Access denied" });
        req.user = decoded; // מכיל _id ו-role
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};

module.exports = { auth, authAdmin };
