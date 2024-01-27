import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthStateService} from "./auth-state.service";

const AUTH_API = '/api';
const TOKEN_KEY = 'auth-token';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private authState: AuthStateService) { }

  login(username: string, password: string): Observable<any> {

    return this.http.post(AUTH_API + '/login', {
      username: username,
      password: password
    }, httpOptions)
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + '/register', {
      username,
      password
    }, httpOptions)
  }

  public isAuthenticated(): boolean {
    return this.authState.isLoggedIn();
  }
}
