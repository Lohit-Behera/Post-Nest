import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_HOST_USER,
            pass: process.env.EMAIL_HOST_PASSWORD
        }
    });
    const info = await transporter.sendMail({
        from: process.env.EMAIL_HOST_USER,
        to: email,
        subject: subject,
        html: htmlContent 
    });
}