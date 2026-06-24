export type UserRole = 'ADMIN' | 'COORDENACAO' | 'DOCENTE';

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  usuario: AuthUser;
}