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
