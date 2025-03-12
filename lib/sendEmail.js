
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, 
  secure: true, // true for port 465, false for 587
  auth: {
    user: 'healthnexus22@gmail.com',
    pass: 'rigtqjgjymowtxwh', // MUST be an app password from Gmail
  },
});


export const sendEmail = async (to, subject, html) => {
    try {
      await transporter.sendMail({
        from: '"HealthNexus" <healthnexus22@gmail.com>', // Must match the user above
        to,
        subject,
        html,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };
