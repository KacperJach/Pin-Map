import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  signOut(): void {
    localStorage.clear();
  }

  public saveUserId(userId: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(userId));
    localStorage.setItem('loggedIn', String(true));
  }

  public getUserId(): any {
    const userId = localStorage.getItem(USER_KEY);
    if (userId) {
      return userId
    }
    return null;
  }

  public isLoggedIn() {
    const userId = localStorage.getItem(USER_KEY);
    return !!userId;

  }
}
