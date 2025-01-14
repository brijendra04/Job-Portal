import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            console.error("Token not provided");
            return res.status(401).json({
                message: "No token provided",
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        req.userId = decoded.userId;
        console.log("Extracted userId:", req.userId);

        next();
    } catch (err) {
        console.error("Error in authenticateToken middleware:", err);
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false,
        });
    }
};

export default authenticateToken;