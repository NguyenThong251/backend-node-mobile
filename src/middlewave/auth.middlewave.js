import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    // verify the token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export default protectedRoute;
