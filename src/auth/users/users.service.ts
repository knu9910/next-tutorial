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
  findAll$(): Observable<User[]> {
    return from(
      this.prisma.user.findMany({
        include: {
          accounts: true, // User와 연결된 Account를 포함
        },
      }),
    );
  }

  // 특정 유저 조회
  findOne$(id: string): Observable<User | null> {
    return from(this.prisma.user.findUnique({ where: { id } }));
  }

  // email이 이미 존재하는지 확인
  findUnique$(email: string): Observable<User | null> {
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

  // 해시 비밀번호 생성
  hashPassword$(password: string): Observable<string> {
    return from(bcrypt.hash(password, 10));
  }

  // 비밀번호 검증
  verifyUserCredentials$(email: string, password: string): Observable<boolean> {
    return from(
      this.prisma.user.findUnique({
        where: { email },
        include: { accounts: true }, // 계정 정보 포함
      }),
    ).pipe(
      mergeMap((user) => {
        // 사용자 또는 계정이 없으면 예외를 던짐
        if (!user || !user.accounts || user.accounts.length === 0) {
          throw new UnprocessableEntityException('사용자를 찾을 수 없습니다.');
        }

        const storedPassword = user.accounts[0].password; // 첫 번째 계정의 비밀번호 가져오기

        // storedPassword가 null인 경우 예외를 던짐
        if (!storedPassword) {
          throw new UnauthorizedException('저장된 비밀번호가 없습니다.');
        }

        // 비밀번호 비교
        return from(bcrypt.compare(password, storedPassword)).pipe(
          mergeMap((isValid) => {
            if (!isValid) {
              throw new UnauthorizedException('잘못된 비밀번호입니다.');
            }
            return from([true]); // 비밀번호가 맞으면 true 반환
          }),
        );
      }),
    );
  }

  // 회원가입 (유저 + 계정 생성)
  create$(email: string, password: string): Observable<CreateUserResponseDto> {
    return this.findUnique$(email).pipe(
      mergeMap(() => this.hashPassword$(password)),
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
        this.responseService.createUserResponse$(
          '생성이 완료되었습니다.',
          user.id,
          201,
        ),
      ),
    );
  }

  // 로그인 (이메일과 비밀번호 인증 후 accessToken 및 refreshToken 발급)
  signIn$(
    email: string,
    password: string,
  ): Observable<{ access_token: string; refresh_token: string }> {
    return this.verifyUserCredentials$(email, password).pipe(
      mergeMap(() => {
        // 이메일과 비밀번호가 유효하면 JWT 토큰 생성
        const payload = { email }; // payload에 이메일 추가
        const access_token: string = this.jwtService.sign(payload, {
          expiresIn: '15m', // 15분짜리 accessToken
        });
        const refresh_token: string = this.jwtService.sign(payload, {
          expiresIn: '7d', // 7일짜리 refreshToken
        });

        return from([
          {
            access_token,
            refresh_token,
          },
        ]);
      }),
    );
  }

  // 유저 정보 업데이트
  update$(id: string, dto: UserDto): Observable<User> {
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
  remove$(id: string): Observable<User> {
    return from(this.prisma.user.delete({ where: { id } }));
  }
}
