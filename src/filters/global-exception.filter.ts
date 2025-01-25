import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal server error';
    let message = [error];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if(exceptionResponse.error){
        if(Array.isArray(exceptionResponse.message)){
            message = exceptionResponse.message;
        }
        else{
            message = [exceptionResponse.message];
        }
        error = exceptionResponse.error;
      }
      else{
        return response.status(status).json(exceptionResponse);
      }
      
    } else if (exception instanceof Error) {
        error = 'Something went wrong!'
        message = [error];
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: error
    });
  }
}