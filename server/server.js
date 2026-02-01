import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config.js';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import progressRouter from './routes/progressRoutes.js';
import quizRouter from './routes/quizRoutes.js';
import aptitudeQuizRouter from './routes/aptitudeQuizRoutes.js';


const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:8080"],
    credentials: true
}));

app.get("/", (req, res) => res.send("AI Interview Platform Server is running!"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/progress', progressRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/aptitude-quiz', aptitudeQuizRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});