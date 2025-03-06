// session-log.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SessionLogService {
  constructor(private readonly prisma: PrismaService) {}

  // SessionLog에 저장하는 메소드
  createSessionLog(
    accountId: string,
    refreshToken: string,
    ipAddress: string,
    browserInfo: string,
  ) {
    return this.prisma.sessionLog.create({
      data: {
        accountId,
        token: refreshToken,
        ipAddress,
        browserInfo,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후 만료
      },
    });
  }
}
