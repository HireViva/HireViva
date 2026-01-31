import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // For development
    }
});



// Verify connection (non-blocking)
(async () => {
    try {
        await transporter.verify();
        console.log('✅ SMTP Server is ready to send emails');
    } catch (error) {
        console.error('❌ SMTP Connection Error:', error.message);
        console.error('Full error:', error);
        console.log('📧 Email configuration:');
        console.log('  - Host:', process.env.EMAIL_HOST);
        console.log('  - Port:', process.env.EMAIL_PORT);
        console.log('  - User:', process.env.EMAIL_USER);
        console.log('  - Pass length:', process.env.EMAIL_PASS?.length || 0);
    }
})();


export default transporter;


