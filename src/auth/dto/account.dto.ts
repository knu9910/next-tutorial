export class AccountDto {
  userId: string;
  provider: string;
  providerId: string;
  password?: string; // 로컬 회원가입일 때만 비밀번호 필요
}
