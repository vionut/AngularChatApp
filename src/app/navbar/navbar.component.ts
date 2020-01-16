import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { SendBirdService } from '../sendbird.service';

@Component({
  selector: 'app-navbar',
  template: `
  <div *ngIf="(token && !isExpired) || socialToken" class="ui menu">
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
  socialToken;
  tokenChangedSub: Subscription;
  constructor(
    public router: Router,
    public dataService: DataService,
    public sendbirdService: SendBirdService
  ) {
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
    if (this.isExpired) {
      this.socialToken = localStorage.getItem('socialToken');
    }
    console.log(this.socialToken);
    this.isAdmin = this.token
      ? jwtHelper.decodeToken(this.token).user.role === 'admin'
        ? true
        : false
      : false;
    console.log(jwtHelper.decodeToken(this.token));
  }

  onLogout() {
    this.sendbirdService.disconnectFromSb().subscribe(data => {
      console.log(data);
      this.token = null;
      this.socialToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('socialToken');
      localStorage.removeItem('socialId');
      localStorage.clear();
      this.router.navigate(['/sign-in']);
    });
  }
}
