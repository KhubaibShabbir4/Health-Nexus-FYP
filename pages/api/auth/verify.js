import { authenticateToken } from './route.js';

export default function handler(req, res) {
  const user = authenticateToken(req, res);
  if (!user) return; // Middleware handles the response for unauthorized access

  return res.status(200).json(user); // Return user info if authorized
}
