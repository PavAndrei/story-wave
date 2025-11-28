import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectToDB from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import errorHandler from './middleware/errorHandler';
import { OK } from 'constants/http';

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

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(
    `The server is running on port ${PORT} in ${NODE_ENV} environment ✅`
  );
  await connectToDB();
});
