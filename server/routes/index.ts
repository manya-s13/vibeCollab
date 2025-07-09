import express from "express";
import { checkAuth, getProfile, signin, signOut, signup, VerifyToken } from "../controllers/authControl";
import { create } from "../controllers/sessionControl";

const router = express.Router();

router.get("/health", (req, res) => { 
    res.status(200).json({ status: "ok" });
});

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile" , VerifyToken, getProfile);
router.post("/signout", VerifyToken, signOut);
router.get("/checkauth", VerifyToken, checkAuth )
router.get("/createsession", create)

export default router;