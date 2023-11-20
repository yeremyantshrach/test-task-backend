import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DefaultExceptionDto } from '@/common/dtos/default-exception.dto';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import { QueryFailedError } from 'typeorm';
import { Environment } from '@/common/enums';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly defaultErrorMessage = 'Unknown error';
  private readonly prodEnvIdentifier = Environment.Prod;
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly env: string,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    let responseBody: DefaultExceptionDto;
    if (exception instanceof TypeORMError) {
      responseBody = this.handleTypeOrmError(exception);
    } else {
      responseBody = this.handleDefault(exception);
    }
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    httpAdapter.reply(
      host.switchToHttp().getResponse(),
      responseBody,
      responseBody.status,
    );
  }

  private handleTypeOrmError(error: TypeORMError): DefaultExceptionDto {
    let message: string;
    if (this.env == this.prodEnvIdentifier) {
      message = this.defaultErrorMessage;
    } else {
      message =
        error instanceof QueryFailedError
          ? error.driverError.detail
          : error.message;
    }
    return {
      status: 500,
      message: message,
    };
  }

  private handleDefault(exception: any): DefaultExceptionDto {
    const message = this.getMessage(exception);
    const statusCode = this.getStatusCode(exception);
    return {
      status: statusCode,
      message: message,
    };
  }
  private getMessage(e: any): string {
    return (
      e?.response?.data?.error_description ??
      e.message ??
      this.defaultErrorMessage
    );
  }

  private getStatusCode(e: any): number {
    if (!isNaN(e?.response?.status)) {
      return Number(e.response.status);
    } else if (!isNaN(e?.response?.statusCode)) {
      return Number(e.response.statusCode);
    } else if (!isNaN(e.status)) {
      return Number(e.status);
    }
    return 500;
  }
}
