import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { bgRed, white } from "colorette";

/**
 * Catches all unhandled exceptions thrown by the application and returns an appropriate HTTP response.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private mongoErrorStatuses = new Map<number, [HttpStatus, string]>([
    [11000, [HttpStatus.CONFLICT, "Conflict: duplicate data exists."]],
    [11001, [HttpStatus.CONFLICT, "Conflict: duplicate data exists."]],
    [12582, [HttpStatus.CONFLICT, "Conflict: duplicate data exists."]],
    [13, [HttpStatus.FORBIDDEN, "Forbidden: Unauthorized action."]],
    [16759, [HttpStatus.GONE, "Data not available anymore."]],
    [20, [HttpStatus.GONE, "Data not available anymore."]],
    [
      50,
      [
        HttpStatus.REQUEST_TIMEOUT,
        "Operation exceeded the maximum execution time.",
      ],
    ],
    [16460, [HttpStatus.CONFLICT, "Conflict: Concurrent write operations."]],
    [16837, [HttpStatus.GONE, "Data not available anymore."]],
  ]);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let message: string | object =
      exception?.message || "Something went wrong!";
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else if (
      exception &&
      exception.code &&
      this.mongoErrorStatuses.has(exception.code)
    ) {
      const statusArray = this.mongoErrorStatuses.get(exception.code);
      if (statusArray && statusArray.length > 0) {
        status = statusArray[0];
      }
    }

    if (status === this.mongoErrorStatuses.get(exception.code)?.[0]) {
      message = {
        mongoErrorCode: exception.code,
        error: this.mongoErrorStatuses.get(exception.code)?.[1],
      };
    } else if (exception instanceof HttpException) {
      message = exception.getResponse();
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
