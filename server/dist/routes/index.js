"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersRoutes_1 = __importDefault(require("./usersRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', usersRoutes_1.default);
router.get('/health', (re, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
exports.default = router;
