import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { User } from '@prisma/client';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() dto: UserDto): Observable<User> {
    return this.userService.create(dto);
  }
}
