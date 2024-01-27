
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AuthService } from './auth.service';
import {inject} from "@angular/core";
import {Observable} from "rxjs";


  export const AuthGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree=> {

    return inject(AuthService).isAuthenticated()
      ? true
      : inject(Router).createUrlTree(['/login']);

  };

