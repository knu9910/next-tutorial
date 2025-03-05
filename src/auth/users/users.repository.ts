import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { Observable, from } from 'rxjs';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 모든 유저를 조회하는 메서드
  findAll(): Observable<User[]> {
    return from(this.prisma.user.findMany());
  }

  // id로 유저를 조회하는 메서드
  findOne(id: string): Observable<User | null> {
    return from(this.prisma.user.findUnique({ where: { id } }));
  }

  // 유저를 생성하는 메서드
  create(dto: UserDto): Observable<User> {
    return from(this.prisma.user.create({ data: dto }));
  }

  // 유저 정보를 업데이트하는 메서드
  update(id: string, dto: UserDto): Observable<User> {
    return from(this.prisma.user.update({ where: { id }, data: dto }));
  }

  // 유저를 삭제하는 메서드
  remove(id: string): Observable<User> {
    return from(this.prisma.user.delete({ where: { id } }));
  }
}
