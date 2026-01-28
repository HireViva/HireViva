import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false // For development
    }
});


// Verify connection (non-blocking)
// Commented out to prevent server crashes - email functionality works without verification
/*
transporter.verify(function (error, success) {
    if (error) {
        console.warn('⚠️  SMTP Connection Warning:', error.message);
        console.log('📧 Email functionality may be limited, but server will continue running');
    } else {
        console.log('✅ SMTP Server is ready to send emails');
    }
}).catch(err => {
    console.warn('⚠️  SMTP verification failed:', err.message);
});
*/

export default transporter;

