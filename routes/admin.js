import express from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getAllOrders,
  getRankedUsers,
  getSingleProduct,
  getTopSelling,
  getUsers,
  receiveOrder,
  verifyUser,
} from "../controllers/adminControllers.js";

const app = express.Router();

app.get("/ranked-users", getRankedUsers);

app.get("/top-selling", getTopSelling);

app.get("/users", getUsers);

app.patch("/verify-user/:userId", verifyUser);

app.post("/add-product", addProduct);

app.get("/product/:productId", getSingleProduct);

app.patch("/edit-product/:productId", editProduct);

app.delete("/delete-product/:productId", deleteProduct);

app.get("/get-orders", getAllOrders);

app.patch("/receive-order/:orderId", receiveOrder);
export default app;
