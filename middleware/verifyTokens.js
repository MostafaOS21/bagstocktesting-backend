import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken.js";

const verifyToken = async (req, res, next) => {
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

        res.cookie("bagstockrerefreshtoken", null, { maxAge: 0 });
        res.cookie("bagstockaccesstoken", null, { maxAge: 0 });

        const error = new Error("Unauthorized!");
        error.statusCode = 401;
        return next(error);
      }

      jwt.verify(accessToken, process.env.JWT_ACCESS, (err, decode2) => {
        if (err) {
          const newAccessToken = jwt.sign(decode1, process.env.JWT_ACCESS);

          res.cookie("bagstockaccesstoken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: process.env.ACCESS_TOKEN_EXP * 1000,
          });
        }

        req.userId = decode1.id;

        next();
      });
    });
  } catch (error) {
    return next(error);
  }
};

export default verifyToken;
