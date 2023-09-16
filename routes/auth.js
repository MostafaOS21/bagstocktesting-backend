import express from "express";
import {
  signIn,
  signUp,
  verifyAuth,
  logOut,
} from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/verify-auth", verifyAuth);

router.post("/logout", logOut);

export default router;
