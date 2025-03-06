import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'Response data including message and userId',
    example: { message: 'User created successfully', userId: '12345' },
  })
  data: {
    message: string;
    userId: string;
  };

  @ApiProperty({
    description: 'HTTP status code of the response',
    example: 201,
  })
  @IsNumber()
  statusCode: number;
}

export function createUserResponse(
  message: string,
  userId: string,
  statusCode: number,
): CreateUserResponseDto {
  return {
    data: {
      message,
      userId,
    },
    statusCode,
  };
}
