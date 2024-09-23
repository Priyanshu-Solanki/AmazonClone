const jwt = require("jsonwebtoken")
const user = require("../Models/userSchema")
const secretKey = process.env.KEY

const authenticate = async (req, res, next) => {
    console.log("Cookies:", req.cookies); // Log incoming cookies
    const token = req.cookies.Amazonweb;

    if (!token) {
        console.log("No token provided"); // Log if no token
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const verifyToken = jwt.verify(token, secretKey);
        console.log("Verified Token:", verifyToken); // Log the verified token

        const rootUser = await USER.findOne({ _id: verifyToken._id, "tokens.token": token });
        console.log("Root User:", rootUser); // Log root user details

        if (!rootUser) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
    } catch (err) {
        console.error("Authentication Error:", err);
        res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

module.exports = authenticate
