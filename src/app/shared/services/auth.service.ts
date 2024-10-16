import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authKey = 'authorizedUser';

  constructor() { }

  login (username: string, password: string): boolean {
    const validUsername = 'admin';
    const validPassword = 'admin123';
    if (username === validUsername && password === validPassword) {
      localStorage.setItem(this.authKey, JSON.stringify({ username }));
      return true;
    }

    return false;
  }

  isLoggedIn (): boolean {
    return localStorage.getItem(this.authKey) !== null;
  }

  logout (): void {
    localStorage.removeItem(this.authKey);
  }

  getAuthorizedUser (): any {
    const user = localStorage.getItem(this.authKey);
    return user ? JSON.parse(user) : null;
  }
}
