import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BlackList from "../models/blackListerToken.js";

const userController = {
  registerUser: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All details are required",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Account already exists, please login",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, password: hashPassword });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        userId: newUser._id,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Missing credentials" });
      }

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

      res.json({ success: true, message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  logoutUser: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Authorization token missing" });
      }

      const token = authHeader.split(" ")[1];
      await BlackList.create({ token });

      res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      await User.findByIdAndDelete(userId);
      res.json({ success: true, message: "User deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default userController;