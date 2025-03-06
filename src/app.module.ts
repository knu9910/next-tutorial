import { Module } from '@nestjs/common';
import { UsersModule } from './auth/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [UsersModule, PrismaModule, ResponseModule], // ✅ UsersService를 여기서 제거해야 함
  controllers: [],
  providers: [], // ✅ UsersService를 providers에 추가
})
export class AppModule {}
