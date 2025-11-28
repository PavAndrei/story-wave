import { INTERNAL_SERVER_ERROR } from 'constants/http';
import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`PATH: ${req.path}`, error);
  return res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
};

export default errorHandler;
