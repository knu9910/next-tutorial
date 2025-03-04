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

  findOne(id: number): Observable<User | null> {
    return this.userRepository.findOne(id);
  }

  create(dto: UserDto): Observable<User> {
    return this.userRepository.create(dto);
  }

  update(id: number, dto: UserDto): Observable<User> {
    return this.userRepository.update(id, dto);
  }

  remove(id: number): Observable<User> {
    return this.userRepository.remove(id);
  }
}
