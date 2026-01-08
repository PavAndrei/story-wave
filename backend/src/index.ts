import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectToDB from './config/db.js';
import { OK } from './constants/http.js';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env.js';

import errorHandler from './middleware/errorHandler.js';
import { setRequestExtensions } from './middleware/requestExtension.js';
import authenticate from './middleware/authentificate.js';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import sessionRoutes from './routes/session.route.js';
import blogRoutes from './routes/blog.route.js';
import uploadRoutes from './routes/upload.route.js';
import commentRoute from './routes/comment.route.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.get('/', (req, res, next) => {
  return res.status(OK).json({ status: 'healthy' });
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/session', setRequestExtensions, authenticate, sessionRoutes);
app.use('/blog', blogRoutes);
app.use('/upload', setRequestExtensions, authenticate, uploadRoutes);
app.use('/comment', commentRoute);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(
    `The server is running on port ${PORT} in ${NODE_ENV} environment ✅`
  );
  await connectToDB();
});
