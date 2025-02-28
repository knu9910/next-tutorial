import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { Observable } from 'rxjs';
import { User } from '@prisma/client';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  findAll(): Observable<User[]> {
    return this.userRepository.findAll();
  }

  create(dto: UserDto): Observable<User> {
    return this.userRepository.create(dto);
  }
}
