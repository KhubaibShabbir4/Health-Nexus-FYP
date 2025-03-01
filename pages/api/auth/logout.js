import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method === 'POST') {
    res.setHeader('Set-Cookie', serialize('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Set cookie expiration to the past
      path: '/',
    }));

    return res.status(200).json({ message: 'Logged out successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
