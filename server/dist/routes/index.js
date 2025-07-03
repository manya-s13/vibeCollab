"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
router.post("/signup", authController_1.signup);
exports.default = router;
