import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly loginUrl =
    'http://test-demo.aemenersol.com/api/account/login';

  private readonly tokenKey = 'aem_auth_token';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const request: LoginRequest = {
      username,
      password
    };

    return this.http.post<any>(this.loginUrl, request).pipe(
      tap(response => {
        const token = this.extractToken(response);

        if (token) {
          localStorage.setItem(this.tokenKey, token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private extractToken(response: any): string | null {

    if (typeof response === 'string') {
      return response;
    }

    if (response?.token) {
      return response.token;
    }

    if (response?.access_token) {
      return response.access_token;
    }

    return null;
  }
}