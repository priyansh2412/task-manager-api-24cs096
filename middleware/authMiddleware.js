const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {

    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization token required"
        });
    }

    // Get token
    const token = authHeader.split(" ")[1];

    try {

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store user information
        req.user = decoded;

        // Continue to next middleware/route
        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

}

module.exports = authenticate;