// Framework
import express from "express";

// Routes
import authRoute from "./routes/auth.js";
import productsRoute from "./routes/products.js";
import userRoute from "./routes/user.js";
import adminRoute from "./routes/admin.js";

// Packages
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect } from "mongoose";

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: "GET, POST, PATCH",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/auth", authRoute);
app.use("/products", productsRoute);
app.use("/users", userRoute);
app.use("/admin", adminRoute);

app.use((error, req, res, next) => {
  // console.log("~~~~~~~~~~~~ GLOBAL");
  // console.log("~~~~~~~~~~~~ GLOBAL");
  // console.log(error);
  // console.log("~~~~~~~~~~~~ GLOBAL");
  // console.log("~~~~~~~~~~~~ GLOBAL");

  return res.status(error.statusCode || 500).json({ msg: error.message });
});

connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT || 8080);
});
