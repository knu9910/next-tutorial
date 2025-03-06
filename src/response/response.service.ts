import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { CreateUserResponseDto } from './response.dto';

@Injectable()
export class ResponseService {
  createUserResponse(
    message: string,
    userId: string,
    statusCode: number,
  ): Observable<CreateUserResponseDto> {
    const response: CreateUserResponseDto = {
      data: {
        message,
        userId,
      },
      statusCode,
    };

    return from([response]); // Observable로 감싸서 반환
  }
}
