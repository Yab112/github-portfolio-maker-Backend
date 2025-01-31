import nodemailer from "nodemailer";
import emailTemplates from "../utils/emailTemplates.js";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Verification',
        html: emailTemplates.otpTemplate(otp),  // Use the template
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP email sent successfully.");
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
};

const sendPasswordReset = async (email,token)=>{
    const mailOptions={
        from:process.env.EMAIL_USER,
        to:email,
        subject:"Change your Password",
        html:emailTemplates.sendPasswordReset(token)
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log("reset password email send successfully")
    } catch (error) {
        console.log("Error sending reset password email",error)
        
    }
}

export { sendOTP,sendPasswordReset };
