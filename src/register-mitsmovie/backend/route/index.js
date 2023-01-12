import express from "express";
import { getUser, Register, Login, Logout } from "../controller/User.js";
import { tokenVerifikasi } from "../middleware/VerifiyToken.js";
import { tokenRefresh } from "../controller/RefreshToken.js";

const router = express.Router();

router.get("/user", tokenVerifikasi, getUser);
router.post("/user", Register);
router.post("login", Login);
router.get("/token", tokenRefresh);
router.delete("/logout", Logout);

export default router;
