import User from "../models/user.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

export const getRankedUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({ totoalOrders: { $gt: "0" } })
      .sort({ totoalOrders: -1 })
      .limit(3);

    const users = allUsers.map((user) => {
      return {
        username: user.username,
        total: user.totoalOrders,
        code: user.code,
        address: user.address,
        phoneNumber: user.phoneNumber,
      };
    });
    return res.json({ allUsers: users });
  } catch (error) {
    next(error);
  }
};

export const getTopSelling = async (req, res, next) => {
  try {
    const allProducts = await Product.find({ orders: { $gt: "0" } })
      .sort({ orders: -1 })
      .limit(4);

    const products = allProducts.map((product) => {
      return {
        title: product.title,
        price: product.price,
        orders: product.orders,
        imgUrl: product.imgUrl,
      };
    });

    return res.json({ products });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();

    const users = allUsers.map((user) => {
      return {
        _id: user._id,
        username: user.username,
        code: user.code,
        phoneNumber: user.phoneNumber,
        address: user.address,
        status: user.status,
        numberOfDelivers: user.numberOfDelivers,
        totalOrders: user.totoalOrders,
        lastUpdate: user.lastUpdate,
      };
    });

    return res.json({ users });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      const error = new Error("User ID is missing.");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId);

    user.status = "verified";
    user.lastUpdate = new Date();
    await user.save();

    return res.json({ msg: "Saved User!" });
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const { title, imgUrl, description, price, quantity } = req.body;

    if (!title || !imgUrl || !description || !price || !quantity) {
      const error = new Error("All inputs must be filled.");
      error.statusCode = 404;
      throw error;
    }

    await Product.create({
      title,
      price,
      description,
      qunatity: quantity,
      imgUrl,
    });

    return res.json({ msg: "Product added with success." });
  } catch (error) {
    next(error);
  }
};

export const getSingleProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    res.json({ product });
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      const error = new Error("Product ID not found.");
      error.statusCode = 404;
      throw error;
    }

    const { title, qunatity, description, price, imgUrl } = req.body;

    if (!title || !qunatity || !description || !price || !imgUrl) {
      const error = new Error("All inputs must be filled.");
      error.statusCode = 404;
      throw error;
    }

    const product = await Product.findById(productId);

    product.title = title;
    product.qunatity = qunatity;
    product.description = description;
    product.price = price;
    product.imgUrl = imgUrl;

    await product.save();

    res.json({ msg: "Product was updated!" });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      const error = new Error("Product ID not found.");
      error.statusCode = 404;
      throw error;
    }

    const data = await Product.findByIdAndDelete(productId);

    res.json({ productId });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = (
      await Order.find().populate("productId").populate("userId")
    ).reverse();

    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

export const receiveOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    console.log("HEY");
    if (!orderId) {
      const error = new Error("Order ID is missed.");
      error.statusCode = 404;
      throw error;
    }

    const order = await Order.findById(orderId);

    order.delivered = true;

    await order.save();

    res.json({ orderId });
  } catch (error) {
    next(error);
  }
};
