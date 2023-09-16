import User from "../models/user.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

export const requestProduct = async (req, res, next) => {
  const { productId } = req.params;

  try {
    if (!req.userId) {
      const error = new Error("Unauthorized!");
      error.statusCode = 401;
      throw error;
    }

    if (!productId) {
      const error = new Error("Product not existed!");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(req.userId);
    const product = await Product.findById(productId);

    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    if (!product) {
      const error = new Error("Product not found!");
      error.statusCode = 404;
      throw error;
    }

    if (user.status === "pending") {
      const error = new Error("Please wait for verification!");
      error.statusCode = 401;
      throw error;
    } else if (user.status === "expired") {
      const error = new Error("Account is expired, Please verify!");
      error.statusCode = 401;
      throw error;
    }

    if (product.qunatity === 0) {
      const error = new Error("Sorry, the product is out.");
      error.statusCode = 401;
      throw error;
    }

    if (user.numberOfDelivers === 0) {
      const error = new Error("Reached maximum orders.");
      error.statusCode = 404;
      throw error;
    }

    // 2628000

    const currDate = new Date().getTime() / 1000;
    const lastUpdate = new Date(user.lastUpdate).getTime() / 1000;

    const subDates = currDate - lastUpdate;

    if (subDates > 2628000) {
      user.status = "expired";
      await user.save();

      const error = new Error("Account exired, please revalidate!");
      error.statusCode = 401;
      throw error;
    }

    product.qunatity -= 1;
    user.numberOfDelivers -= 1;
    user.totoalOrders += 1;

    await user.save();
    await product.save();

    // Create Order!
    await Order.create({
      productId: product._id,
      userId: user._id,
    });

    res.json({ msg: "Ordered with success!", productId, user });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      const error = new Error("Unauthorized!");
      error.statusCode = 401;
      throw error;
    }

    const orders = await Order.find({ userId: userId }).populate("productId");

    console.log(orders);

    return res.json({ orders });
  } catch (error) {
    next(error);
  }
};
