import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/http';
import { ErrorRequestHandler, Response } from 'express';
import z from 'zod';

// handling zod errors

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }));

  return res.status(BAD_REQUEST).json({
    message: error.message,
    errors,
  });
};

// handling errors

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`PATH: ${req.path}`, error);

  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }
  return res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
};

export default errorHandler;
