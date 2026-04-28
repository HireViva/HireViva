import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config.js';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import progressRouter from './routes/progressRoutes.js';
import quizRouter from './routes/quizRoutes.js';
import interviewRouter from './routes/interviewRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aptitudeQuizRouter from './routes/aptitudeQuizRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import subscriptionRouter from './routes/subscriptionRoutes.js';
import initCronJobs from './utils/cronJobs.js';


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Initialize cron jobs for subscription management
initCronJobs();

// Raw body parsing for Razorpay webhook signature verification
// Must be registered BEFORE express.json() for the webhook route
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());

// Enhanced CORS Configuration for production and development
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000',
    'https://hireviva.vercel.app',
    'https://*.vercel.app',
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin matches any allowed pattern
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed === origin) return true;
            // Handle wildcard domains
            if (allowed.includes('*')) {
                const pattern = allowed.replace('*', '.*');
                return new RegExp(pattern).test(origin);
            }
            return false;
        });
        
        if (isAllowed || !process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}));

app.get("/", (req, res) => res.send("AI Interview Platform Server is running!"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/progress', progressRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/aptitude-quiz', aptitudeQuizRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/subscription', subscriptionRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});