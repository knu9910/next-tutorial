import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { from, Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Observable<User[]> {
    return from(this.prisma.user.findMany());
  }

  create(dto: UserDto): Observable<User> {
    return from(this.prisma.user.create({ data: dto }));
  }
}
