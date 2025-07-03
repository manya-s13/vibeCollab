"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = exports.signOut = exports.getProfile = exports.VerifyToken = exports.signin = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function setTokenCookie(res, token) {
    const isProduction = process.env.NODE_ENV === 'production';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    // Calculate expiration date
    const expirationTime = expiresIn.includes('d')
        ? parseInt(expiresIn) * 24 * 60 * 60 * 1000 // days to milliseconds
        : parseInt(expiresIn) * 60 * 60 * 1000; // hours to milliseconds
    const expirationDate = new Date(Date.now() + expirationTime);
    res.cookie('authToken', token, {
        httpOnly: true, // Prevents client-side JavaScript access
        secure: isProduction, // Only send over HTTPS in production
        sameSite: 'strict', // CSRF protection
        maxAge: expirationTime,
        expires: expirationDate,
        path: '/'
    });
}
// Helper method to clear cookie
function clearTokenCookie(res) {
    res.cookie('authToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
        path: '/'
    });
}
const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }
        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
        }
        const salt = 12;
        const hashedpass = await bcrypt_1.default.hash(password, salt);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedpass,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        setTokenCookie(res, token);
        return res.status(201).json({ message: "User craeted Successfully", data: { user } });
    }
    catch (error) {
        console.log('signup error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        setTokenCookie(res, token);
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ message: "Signin Successful", data: { user: userWithoutPassword } });
    }
    catch (error) {
        console.log("Signin Failed", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
};
exports.signin = signin;
const VerifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized, No token provided" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });
        if (!user) {
            clearTokenCookie(res);
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        clearTokenCookie(res);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};
exports.VerifyToken = VerifyToken;
const getProfile = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: {
                user: req.user
            }
        });
    }
    catch (error) {
        console.log("Get Profile error", error);
        return res.status(500).json({
            success: false,
            message: " Internal server error"
        });
    }
};
exports.getProfile = getProfile;
const signOut = async (req, res) => {
    try {
        clearTokenCookie(res);
        return res.status(200).json({
            success: true,
            message: "signed out successfully"
        });
    }
    catch (error) {
        console.log('Sign out error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.signOut = signOut;
const checkAuth = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'User is authenticated',
            data: {
                user: req.user
            }
        });
    }
    catch (error) {
        console.log('Check Auth error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.checkAuth = checkAuth;
