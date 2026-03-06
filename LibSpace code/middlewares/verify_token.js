import jwt from "jsonwebtoken";
import BlackList from "../models/blackListerToken.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    const blacklisted = await BlackList.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ msg: "Token expired or logged out, please login again" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: "Invalid token", error: err.message });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
};