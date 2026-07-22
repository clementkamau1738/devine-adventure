import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface RequestUser extends JwtPayload {
  refreshToken?: string | null;
}
