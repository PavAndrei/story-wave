import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectToDB from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';

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

app.get('/', (req, res) => {
  return res.status(200).json({ status: 'healthy' });
});

app.listen(4004, async () => {
  console.log(
    `The server is running on port ${PORT} in ${NODE_ENV} environment ✅`
  );
  await connectToDB();
});
