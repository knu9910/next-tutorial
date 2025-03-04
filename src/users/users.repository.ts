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

  findOne(id: number): Observable<User | null> {
    return from(this.prisma.user.findUnique({ where: { id } }));
  }

  create(dto: UserDto): Observable<User> {
    return from(this.prisma.user.create({ data: dto }));
  }

  update(id: number, dto: UserDto): Observable<User> {
    return from(this.prisma.user.update({ where: { id }, data: dto }));
  }

  remove(id: number): Observable<User> {
    return from(this.prisma.user.delete({ where: { id } }));
  }
}
