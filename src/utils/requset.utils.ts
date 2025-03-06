import { Request } from 'express';

export const getIpAddress = (req: Request): string | undefined => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  return Array.isArray(ip) ? ip[0] : ip;
};

export const getBrowserInfo = (req: Request): string => {
  return req.headers['user-agent'] || ''; // 브라우저 정보 추출 (없을 경우 빈 문자열 반환)
};
