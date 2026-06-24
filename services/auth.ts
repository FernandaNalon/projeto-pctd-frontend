import { apiFetch } from './api';
import type { LoginResponse } from '@/types/auth';

export async function login(email: string, senha: string): Promise<LoginResponse> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

export function salvarSessao(data: LoginResponse) {
  localStorage.setItem('pctd_token', data.access_token);
  localStorage.setItem('pctd_user', JSON.stringify(data.usuario));
}

export function sair() {
  localStorage.removeItem('pctd_token');
  localStorage.removeItem('pctd_user');
}