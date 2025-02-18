import cors from 'cors';
import morgan from "morgan";
import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import passport from 'passport';

dotenv.config();

const app = express();
app.use(passport.initialize());
// Middleware
app.use(helmet());
app.use(morgan('dev'))
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

export default app;
