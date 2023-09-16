import Product from "../models/product.js";
import User from "../models/user.js";
import Order from "../models/order.js";

export const getProducts = async (req, res, next) => {
  console.log("products");

  try {
    let products = await Product.find();

    res.json({ products });
  } catch (error) {
    next(error);
  }
};
