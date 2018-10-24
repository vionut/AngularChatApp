import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  template: `
  <div *ngIf="token && !isExpired" class="ui menu">
    <div class="header item">
      Angular chat
    </div>
    <a [routerLink]="['/chat']" class="item">
      Chat
    </a>
    <div class="right menu">
      <a *ngIf="isAdmin" [routerLink]="['/admin-panel']" class="item">Admin Panel</a>
      <a class="item" (click)="onLogout()">Logout</a>
    </div>
  </div>`,
  styles: [
    `
      .menu {
        margin: 0;
        height: 50px;
      }

      .compact {
        box-shadow: none;
      }
    `
  ]
})
export class NavbarComponent implements OnInit {
  token;
  isExpired;
  isAdmin;
  tokenChangedSub: Subscription;
  constructor(public router: Router, public dataService: DataService) {
    this.tokenChangedSub = dataService.tokenChanged.subscribe(data => this.init());
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.tokenChangedSub.unsubscribe();
  }

  init() {
    this.token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
    const jwtHelper = new JwtHelperService();
    this.isExpired = this.token ? jwtHelper.isTokenExpired(this.token) : true;
    this.isAdmin = this.token
      ? jwtHelper.decodeToken(this.token).user.role === 'admin'
        ? true
        : false
      : false;
    console.log(jwtHelper.decodeToken(this.token));
  }

  onLogout() {
    this.token = null;
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }
}
