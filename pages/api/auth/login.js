import prisma from '/lib/prisma';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = 'your-secret-key'; // Replace with an environment variable
const JWT_EXPIRATION = '30m'; // 30 minutes session timeout

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Log received email and password for debugging
      console.log("Login Attempt:", { email, password });

      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log("User not found for email:", email);
        return res.status(401).json({ error: 'Invalid Email' });
      }

      console.log("User found:", user);

      // Compare the provided password with the stored password
      // In production, you should hash passwords using bcrypt
      if (password !== user.password) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { email: user.email, id: user.id }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRATION }
      );

      // Set the token as an HTTP-only cookie
      res.setHeader('Set-Cookie', serialize('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 60, // 30 minutes
        path: '/',
      }));

      // Authentication successful
      console.log("Authentication successful for user:", user.email);
      return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
