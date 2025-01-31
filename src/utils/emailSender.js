import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const emailSender = {
  sendVerificationEmail: (email, otp) => transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Email Verification OTP',
    text: `Your verification code is: ${otp}`
  }),

  sendPasswordResetEmail: (email, otp) => transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your password reset code is: ${otp}`
  })
};