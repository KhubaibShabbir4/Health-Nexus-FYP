import { sendEmail } from '../../../lib/sendEmail';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiry to 10 minutes from now
    const expiryTime = Date.now() + 10 * 60 * 1000;

    // IMPORTANT: for local dev on http://localhost:3000, set secure: false
    // so the cookies will actually be set. Otherwise, they require HTTPS.
    // For production, keep secure as true.
    const isProduction = process.env.NODE_ENV === 'production';

    res.setHeader('Set-Cookie', [
      serialize(`otp_${email}`, otp, {
        httpOnly: true,
        secure: isProduction,     // set to false if testing on localhost
        sameSite: 'strict',       // or use 'lax' if you have cross-site usage
        path: '/',
        maxAge: 600 // 10 minutes
      }),
      serialize(`otp_expiry_${email}`, expiryTime.toString(), {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        maxAge: 600 // 10 minutes
      })
    ]);
    const subject = 'Verify Your Email - HealthNexus';
    
    // Professional HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background-color: #22c55e;
            color: white;
            border-radius: 10px 10px 0 0;
          }
          .content {
            padding: 30px 20px;
          }
          .otp-container {
            text-align: center;
            padding: 20px;
            margin: 20px 0;
            background-color: #f3f4f6;
            border-radius: 8px;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 4px;
            color: #22c55e;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666666;
            font-size: 12px;
          }
          .warning {
            color: #dc2626;
            font-size: 14px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>Thank you for registering with our healthcare platform. To ensure the security of your account, please verify your email address using the following One-Time Password (OTP):</p>
            
            <div class="otp-container">
              <div class="otp-code">${otp}</div>
              <p>This code will expire in 10 minutes</p>
            </div>
            
            <p>If you did not request this verification code, please ignore this email or contact our support team if you have concerns.</p>
            
            <p class="warning">⚠️ Never share this OTP with anyone. Our team will never ask for your OTP.</p>
            
            <p>Best regards,<br>Healthcare Platform Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} Healthcare Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    await sendEmail(email, subject, htmlContent);

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email successfully!'
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Failed to send OTP' });
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