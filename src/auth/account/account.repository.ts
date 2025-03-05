// AccountRepository 예시
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Account } from '@prisma/client';
import { AccountDto } from './dto/account.dto';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 계정 생성
  async create(dto: AccountDto): Promise<Account> {
    return this.prisma.account.create({ data: dto });
  }
}
