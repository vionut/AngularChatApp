import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  jwtHelper;
  constructor() {
    this.jwtHelper = new JwtHelperService();
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) return true;
    const socialToken = localStorage.getItem('socialToken');
    if (socialToken) return true;
  }

  public isAdmin(): boolean {
    const role = this.jwtHelper.decodeToken(localStorage.getItem('token')).user.role;
    return role === 'admin';
  }
}
