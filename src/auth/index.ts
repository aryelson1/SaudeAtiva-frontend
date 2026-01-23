export function setToken(token: string): void {
    localStorage.setItem('token', token);
}

export function getToken(): string | null {
    return localStorage.getItem('token');
}

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

export function logout(): void {
    localStorage.removeItem('token');
}

import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: string;
  exp: number;
}

export function getLoggedUserId(): string | null {
  const token = localStorage.getItem('token');

  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    // Token expirado
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }

    return decoded.id;
  } catch {
    return null;
  }
}
