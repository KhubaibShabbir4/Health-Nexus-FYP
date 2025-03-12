import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // parse the cookies
    const cookies = parse(req.headers.cookie || '');
    const storedOTP = cookies[`otp_${email}`];
    const storedOTPExpiry = cookies[`otp_expiry_${email}`];

    if (!storedOTP || !storedOTPExpiry) {
      return res.status(400).json({ message: 'OTP has expired or not found' });
    }

    if (Date.now() > parseInt(storedOTPExpiry)) {
      // Clear cookies
      res.setHeader('Set-Cookie', [
        `otp_${email}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        `otp_expiry_${email}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
      ]);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (otp !== storedOTP) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, clear it
    res.setHeader('Set-Cookie', [
      `otp_${email}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      `otp_expiry_${email}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    ]);

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
  /*await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'include',  // <-- crucial!
  });
  
  await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
    credentials: 'include',  // <-- crucial!
  });*/
  
}
