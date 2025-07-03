import { Router, RequestHandler } from "express";
import {signup}  from "../controllers/authController";

const router = Router();

router.get("/health", (req, res) => { 
    res.status(200).json({ status: "ok" });
});
export default router;