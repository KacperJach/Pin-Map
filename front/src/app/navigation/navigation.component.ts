import {Component, inject, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MapComponent} from "../map/map.component";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {NavItem} from "./nav-item";
import { FlexLayoutModule } from '@angular/flex-layout';
import {AuthStateService} from "../auth/auth-state.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    NgIf,
    MapComponent,
    RouterLink,
    NgForOf,
    RouterOutlet,
    FlexLayoutModule
  ]
})

export class NavigationComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  activeItem?: string;

  menu: NavItem [] = [
    {
      displayName: 'Map',
      iconName: 'map',
      route: 'map',
    },
    {
      displayName: 'My pins',
      iconName: 'location_on',
      route: 'pins_list',
    }
  ];

  constructor(private storageService: AuthStateService, private router: Router) {}

  ngOnInit(){
    this.activeItem = this.menu[0].route;
  }

  setActiveItem(page: string) {
    this.activeItem = page;
  }

  logout() {
    this.storageService.signOut();
    this.router.navigate(['login']);
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


}
