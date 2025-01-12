import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const {fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Missing fields required",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });

        await newUser.save();
        return res.status(201).json({
            message: `User created successfully ${fullname}`,
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error registering user",
            success: false,
        });
    }
};

export const login = async (req, res) => {
    try {
        const {email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Missing fields required",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        if (user.role !== role) {
            return res.status(403).json({
                message: "You don't have access",
                success: false,
            });
        }

        const tokenData = { userId: user._id };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "Strict",
                secure: true,
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                success: true,
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error login failed",
            success: false,
        });
    }
};

export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logout successfully",
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error logout",
            success: false,
        });
    }
};

export const updatePofile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        if (!fullname || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({
                message: "Missing fields required",
                success: false,
            });
        }

        const skillsArray = skills.split(",").map((skill) => skill.trim());
        const userId = req.userId;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        user.fullname = fullname;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.profile.bio = bio;
        user.profile.skills = skillsArray;
        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error updating profile",
            success: false,
        });
    }
};
