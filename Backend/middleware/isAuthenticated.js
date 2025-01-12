import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.token; 
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token provided",
                success: false,
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

       
        req.id = decoded.userId; 

        next(); 
    } catch (err) {
        console.error(err);
        res.status(401).json({
            message: "Unauthorized: Invalid or expired token",
            success: false,
        });
    }
};

export default authenticateToken;
