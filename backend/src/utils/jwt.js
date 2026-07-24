// src/utils/jwt.js
import jwt from "jsonwebtoken";

/**
 * Signs a token containing just the user's id and email — enough for the
 * middleware to identify who's making the request without needing to hit
 * the database on every single call (though controllers still fetch fresh
 * data when they need up-to-date fields like name/role).
 */
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}