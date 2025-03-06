import { Module } from '@nestjs/common';
import { SessionLogService } from './session-log.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [SessionLogService, PrismaService],
  exports: [SessionLogService], // 다른 모듈에서 사용할 수 있도록 export
})
export class SessionLogModule {}
