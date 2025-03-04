import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
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

  @Get(':id')
  findOne(@Param('id') id: string): Observable<User | null> {
    return this.userService.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: UserDto): Observable<User> {
    return this.userService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UserDto): Observable<User> {
    return this.userService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Observable<User> {
    return this.userService.remove(Number(id));
  }
}
