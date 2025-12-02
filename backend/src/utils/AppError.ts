import AppErrorCode from '../constants/appErrorCode.js';
import { HttpStatusCode } from '../constants/http.js';

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}

new AppError(200, 'Sample error', AppErrorCode.InvalidAccessToken);

export default AppError;
