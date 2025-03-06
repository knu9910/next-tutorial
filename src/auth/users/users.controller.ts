import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { User } from '@prisma/client';
import { LoginDto, UserDto } from '../dto/user.dto';
import { CreateUserResponseDto } from 'src/response/response.dto';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll$(): Observable<User[]> {
    return this.userService.findAll$();
  }

  @Get(':id')
  findOne$(@Param('id') id: string): Observable<User | null> {
    return this.userService.findOne$(id);
  }

  @Post()
  create$(@Body() dto: UserDto): Observable<CreateUserResponseDto> {
    return this.userService.create$(dto.email, dto.password);
  }

  @Post('/signIn')
  localSignIn(
    @Body() dto: LoginDto,
    @Req() req: Request,
  ): Observable<{ access_token: string; refresh_token: string }> {
    return this.userService.localSignIn$(dto, req);
  }

  @Put(':id')
  update$(@Param('id') id: string, @Body() dto: UserDto): Observable<User> {
    return this.userService.update$(id, dto);
  }

  @Delete(':id')
  remove$(@Param('id') id: string): Observable<User> {
    return this.userService.remove$(id);
  }
}
