import assert from 'node:assert';
import AppError from './AppError';
import { HttpStatusCode } from '../constants/http';
import AppErrorCode from '../constants/appErrorCode';

// type definition for the appAsert function

type AppAsert = (
  condition: any,
  HttpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

// Asserts a condition and throw an AppError if the condition is false

const appAsert: AppAsert = (
  condition: any,
  HttpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(HttpStatusCode, message, appErrorCode));

export default appAsert;
