import nodemailer from 'nodemailer';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'niteshkhandelwal0504@gmail.com',
        pass: 'qlkz ajuj yhpp xfed',
      },
    });

    const mailOptions = {
      from: '"Mystry Project" <niteshkhandelwal0504@gmail.com>',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div>
          <h2>Hello ${username},</h2>
          <p>Thank you for registering. Your verification code is:</p>
          <h3>${verifyCode}</h3>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Verification email sent successfully.',
    };
  } catch (err) {
    console.error('Error sending verification email:', err);
    return {
      success: false,
      message: 'Failed to send verification email.',
    };
  }
}
