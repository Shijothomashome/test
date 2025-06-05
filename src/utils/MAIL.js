import nodemailer from 'nodemailer';
import {
    SMTP_USER,
    SMTP_PASS,
    APP_NAME,
    APP_LOGO,
    APP_DESCRIPTION,
} from '../config/index.js';
import { RANDOM_OTP } from './SMS.js';

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // Change if using other SMTP providers
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

// HTML renderer for styled emails
const HTML_RENDER = (content) => {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
        <div style="text-align: center;">
          <img src="${APP_LOGO}" alt="${APP_NAME} Logo" style="height: 60px; margin-bottom: 10px;" />
          <h2 style="color: #333;">Welcome to ${APP_NAME}!</h2>
        </div>
        <p style="color: #555;">${APP_DESCRIPTION}</p>
        <hr style="margin: 20px 0;" />
        <p style="color: #333; font-size: 16px;">${content}</p>
        <p style="color: #999; font-size: 12px; text-align: center;">Please do not reply to this email. For support, contact us through the app.</p>
      </div>
    </div>`;
};

// Generic email sender
const SEND_EMAIL = async ({ to, subject, text, html }) => {
    try {
        if (!to || !subject || (!text && !html)) {
            return {
                success: false,
                error: 'Missing required fields: "to", "subject", and "text" or "html".',
            };
        }

        const info = await transporter.sendMail({
            from: `"${APP_NAME}" <${SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log('Email sent:', info.messageId);
        return {
            success: true,
            message: 'Email sent successfully.',
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: error.message || 'Failed to send email.',
        };
    }
};

// Send OTP email
const SEND_EMAIL_OTP = async (to) => {
    const otp = RANDOM_OTP(6);
    const content = `Your verification code is <b>${otp}</b>. Please do not share it with anyone.`;
    const result = await SEND_EMAIL({
        to,
        subject: `Your ${APP_NAME} verification code`,
        text: `Your verification code is ${otp}. Do not share it with anyone.`,
        html: HTML_RENDER(content),
    });
    return { ...result, otp };
};
// console.log(await SEND_EMAIL_OTP("sudhiselampa19@gmail.com"));
export { SEND_EMAIL, SEND_EMAIL_OTP, HTML_RENDER };
