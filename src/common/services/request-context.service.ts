import { Injectable } from '@nestjs/common';
import httpContext from 'express-http-context';

@Injectable()
export class RequestContextService {
  get(key: string) {
    return httpContext.get(key);
  }

  set(key: string, value: unknown) {
    return httpContext.set(key, value);
  }
}
