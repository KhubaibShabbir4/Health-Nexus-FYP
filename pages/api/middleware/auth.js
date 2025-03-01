import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key'; // Replace with the same secret used during login

export function authenticateToken(req, res) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return user; // Return decoded user object if valid
  } catch (error) {
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
}
