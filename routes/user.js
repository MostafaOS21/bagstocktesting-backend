import express from "express";
import verifyToken from "../middleware/verifyTokens.js";
import { requestProduct, getCart } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/request-product/:productId", verifyToken, requestProduct);
router.get("/cart/:userId", verifyToken, getCart);

export default router;
