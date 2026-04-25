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
const PORT = process.env.PORT || 3000;

connectDB();

// Initialize cron jobs for subscription management
initCronJobs();

// Raw body parsing for Razorpay webhook signature verification
// Must be registered BEFORE express.json() for the webhook route
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ['http://localhost:5173', 'http://localhost:8080', 'https://hireviva.vercel.app'];
if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
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