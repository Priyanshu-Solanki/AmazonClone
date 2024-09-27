const jwt = require("jsonwebtoken");
const User = require("../Models/userSchema"); // Ensure model is correctly named
const secretKey = process.env.KEY;

const authenticate = async (req, res, next) => {
    try {
        // console.log("Cookies:", req.cookies); // Log incoming cookies for debugging
        const token = req.cookies.Amazonweb;

        // If no token is found in the cookies, return unauthorized status
        if (!token) {
            // console.log("No token provided");
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify token with the secret key
        const verifyToken = jwt.verify(token, secretKey);
        // console.log("Verified Token:", verifyToken); // Only log during development, remove in production

        // Find the user associated with the token
        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
        // console.log("Root User:", rootUser); // Log root user for debugging, remove in production

        // If the user is not found in the database, return unauthorized status
        if (!rootUser) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        // Attach user details to the request object for further use in the application
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Catch and handle any errors during token verification or database lookup
        console.error("Authentication Error:", err.message || err);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

module.exports = authenticate;