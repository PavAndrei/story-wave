import assert from 'node:assert';
import AppError from './AppError.js';
import { HttpStatusCode } from '../constants/http.js';
import AppErrorCode from '../constants/appErrorCode.js';

// type definition for the appAssert function

type AppAssert = (
  condition: any,
  HttpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

// Asserts a condition and throw an AppError if the condition is false

const appAssert: AppAssert = (
  condition: any,
  HttpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(HttpStatusCode, message, appErrorCode));

export default appAssert;
