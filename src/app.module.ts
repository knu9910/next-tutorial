import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, PrismaModule], // ✅ UsersService를 여기서 제거해야 함
  controllers: [],
  providers: [], // ✅ UsersService를 providers에 추가
})
export class AppModule {}
