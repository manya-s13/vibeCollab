"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.signin = exports.signup = void 0;
const prisma_1 = require("../generated/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new prisma_1.PrismaClient();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json("Please fill in all details");
    }
    const existingUser = yield prisma.user.findFirst({ where: { email } });
    if (existingUser) {
        return res.status(400).json({
            status: "failed",
            data: [],
            message: "It seems you already have an account! Please log in"
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = yield prisma.user.create({
        data: { email, name, password: hashedPassword }
    });
    try {
        res.status(201).json({
            message: "SignUp Successfull",
            user: {
                id: newUser.id,
                email: newUser.email
            }
        });
    }
    catch (error) {
        res.status(500).json("Registration Failed");
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide both email and password" });
    }
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json("User not found");
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res
            .cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        })
            .status(200)
            .json({
            message: "Login Successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        res.status(500).json("Internal Server error");
    }
});
exports.signin = signin;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/'
        });
        res.status(200).json({
            message: "Logout successful",
            isAuthenticated: false
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});
exports.logout = logout;
