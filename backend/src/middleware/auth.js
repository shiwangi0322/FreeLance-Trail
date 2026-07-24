// src/middleware/auth.js
import { verifyToken } from "../utils/jwt.js";

/**
 * Reads "Authorization: Bearer <token>", verifies it, and attaches the
 * decoded payload to req.user. Every protected route (Clients, Projects,
 * Invoices, Documents, Proposals) uses this so req.user.id is available to
 * scope every database query to the logged-in user.
 */
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = decoded; // { id, email }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};