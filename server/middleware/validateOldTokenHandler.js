const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const validateOldToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(" ")[1];
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user.oldtoken.includes(token)) {

                return res.status(401).json({ message: "Access token is not valid" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    next();
});

module.exports = validateOldToken;
