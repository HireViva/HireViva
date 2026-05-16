import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP Connection Error:', error.message);
    } else {
        console.log('✅ SMTP Server is ready to send emails');
    }
});

export const sendEmail = async ({
    to,
    subject,
    html
}) => {
    try {
        const mailOptions = {
            from: `"HireViva" <${process.env.SENDER_EMAIL}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        return info;

    } catch (error) {
        console.error('❌ Email sending failed:', error);
        throw error;
    }
};

export default transporter;
