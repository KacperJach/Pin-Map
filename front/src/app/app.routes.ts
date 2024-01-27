import {Routes} from '@angular/router';
import {MapComponent} from "./map/map.component";
import {LoginComponent} from "./login/login.component";
import {NavigationComponent} from "./navigation/navigation.component";
import {RegisterComponent} from "./register/register.component";
import {AuthGuard} from "./auth/auth-guard.service";
import {PinsListComponent} from "./pins-list/pins-list.component";

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'home', component: NavigationComponent, canActivate: [AuthGuard],
    children: [
      {path: '',  redirectTo: 'map', pathMatch: 'full'},
      {path: 'map', component: MapComponent},
      {path: 'pins_list', component: PinsListComponent},
    ]
  }
];
