import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Prisma 직접 사용
import * as bcrypt from 'bcryptjs';
import { UserDto } from '../dto/user.dto';
import { Provider, User } from '@prisma/client';
import { from, mergeMap, Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt'; // JWT 서비스 추가
import { CreateUserResponseDto } from '../../response/response.dto';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponseService,
    private readonly jwtService: JwtService, // JWT 서비스 의존성 추가
  ) {}

  // 모든 유저 조회
  findAll(): Observable<User[]> {
    return from(
      this.prisma.user.findMany({
        include: {
          accounts: true, // User와 연결된 Account를 포함
        },
      }),
    );
  }

  // 특정 유저 조회
  findOne(id: string): Observable<User | null> {
    return from(this.prisma.user.findUnique({ where: { id } }));
  }

  findUnique(email: string): Observable<User | null> {
    return from(this.prisma.user.findUnique({ where: { email } })).pipe(
      mergeMap((existingUser) => {
        if (existingUser) {
          // 이메일이 중복된 경우 예외를 던짐
          throw new UnprocessableEntityException('이미 존재하는 이메일입니다.');
        }
        // 중복되지 않으면 null 반환
        return from([null]);
      }),
    );
  }

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 10));
  }
  // 회원가입 (유저 + 계정 생성)
  create(email: string, password: string): Observable<CreateUserResponseDto> {
    return this.findUnique(email).pipe(
      mergeMap(() => this.hashPassword(password)),
      mergeMap((hashPass) =>
        this.prisma.user.create({
          data: {
            email,
            accounts: {
              create: {
                provider: Provider.LOCAL,
                providerId: email,
                password: hashPass,
              },
            },
          },
        }),
      ),
      mergeMap((user) =>
        // 사용자 생성 후 responseService로 응답 객체 생성
        this.responseService.createUserResponse(
          '생성이 완료되었습니다.',
          user.id,
          201,
        ),
      ),
    );
  }

  // 로그인 (이메일과 비밀번호 인증 후 accessToken 및 refreshToken 발급)
  // signIn(email: string, password: string | null) : Observable<{ access_token: string; refresh_token: string }> {

  // }

  // 유저 정보 업데이트
  update(id: string, dto: UserDto): Observable<User> {
    return from(
      this.prisma.user.update({
        where: { id },
        data: { ...dto },
        include: {
          accounts: true, // 계정 정보 포함
        },
      }),
    );
  }

  // 유저 삭제
  remove(id: string): Observable<User> {
    return from(this.prisma.user.delete({ where: { id } }));
  }
}
