import User from "../models/user.js";
import bcrypt from "bcrypt";
import RefreshToken from "../models/refreshToken.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { username, phoneNumber, address, password, district } = req.body;

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const randomNum = Math.floor(Math.random() * 5000);

    const editedNumber =
      randomNum < 100 && randomNum >= 10
        ? `00${randomNum}`
        : randomNum < 10
        ? `000${randomNum}`
        : randomNum === 0
        ? `0000`
        : randomNum;

    console.log(district);

    const user = await User.create({
      username,
      phoneNumber,
      code: `${editedNumber}/${district}`,
      address,
      password: hashedPassword,
      district,
    });

    return res.json({
      newUser: {
        username,
      },
      msg: "User created with success!",
    });
  } catch (error) {
    // console.log(error);

    if (error?.message?.includes("duplicate key error collection")) {
      return res.status(422).json({ msg: "Phone number already used!" });
    }

    return res.json({ msg: "Error Ocurred" });
  }
};

export const signIn = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      const error = new Error("User is not existed!");
      error.statusCode = 404;
      throw error;
    }

    const compareResult = await bcrypt.compare(password, user.password);

    const payloadUser = {
      id: user.id,
      username: user.username,
      status: user.status,
      numberOfDelivers: user.numberOfDelivers,
      code: user.code,
    };

    const accessToken = jwt.sign(payloadUser, process.env.JWT_ACCESS, {
      expiresIn: "1h",
    });

    const dbRefreshToken = await RefreshToken.findOne({
      userId: user._id,
      valid: true,
    });

    if (dbRefreshToken) {
      dbRefreshToken.valid = false;
      await dbRefreshToken.save();
    }

    const refreshToken = jwt.sign(payloadUser, process.env.JWT_REFRESH, {
      expiresIn: "7d",
    });

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
    });

    res.cookie("bagstockaccesstoken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: process.env.ACCESS_TOKEN_EXP * 1000,
    });
    res.cookie("bagstockrerefreshtoken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: process.env.REFRESH_TOKEN_EXP * 1000,
    });

    if (!compareResult) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;

      throw error;
    }

    return res.json({ user: payloadUser });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({ msg: error.message });
  }
};

export const verifyAuth = async (req, res, next) => {
  const accessToken = req.cookies["bagstockaccesstoken"];
  const refreshToken = req.cookies["bagstockrerefreshtoken"];

  try {
    const dbRefreshToken = await RefreshToken.findOne({ token: refreshToken });
    if (!refreshToken || !dbRefreshToken || !dbRefreshToken.valid) {
      res.cookie("bagstockrerefreshtoken", null, { maxAge: 0 });
      res.cookie("bagstockaccesstoken", null, { maxAge: 0 });

      const error = new Error("Unauthorized!");
      error.statusCode = 401;
      throw error;
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH, async (err, decode1) => {
      if (err) {
        dbRefreshToken.valid = false;

        await dbRefreshToken.save();

        const error = new Error("Unauthorized!");
        error.statusCode = 401;

        return next(error);
      }

      if (!accessToken) {
        const newAccessToken = jwt.sign(decode1, process.env.JWT_ACCESS);

        res.cookie("bagstockaccesstoken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: process.env.ACCESS_TOKEN_EXP * 1000,
        });

        return res.json({ user: decode1 });
      }

      return jwt.verify(accessToken, process.env.JWT_ACCESS, (err, decode2) => {
        if (err) {
          const newAccessToken = jwt.sign(decode1, process.env.JWT_ACCESS);

          res.cookie("bagstockaccesstoken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: process.env.ACCESS_TOKEN_EXP * 1000,
          });

          return res.json({
            user: decode1,
          });
        } else {
          return res.json({ user: decode2 });
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

export const logOut = async (req, res) => {
  const refreshToken = req.cookies["bagstockrerefreshtoken"];

  try {
    if (refreshToken) {
      const token = await RefreshToken.findOne({ token: refreshToken });
      token.valid = false;

      await token.save();
    }

    res.clearCookie("bagstockaccesstoken");
    res.clearCookie("bagstockrerefreshtoken");

    return res.json({ msg: "Logged out with success!" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ msg: error.message });
  }
};
