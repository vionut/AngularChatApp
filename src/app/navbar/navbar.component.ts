import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
  <div *ngIf="token" class="ui menu">
    <div class="header item">
      Angular chat
    </div>
    <a [routerLink]="['/chat']" class="item">
      Chat
    </a>
    <div class="ui right item">
      <div class="ui compact menu">
        <div class="ui simple dropdown item">
          Profile
          <i class="dropdown icon"></i>
          <div class="menu">
            <div class="item">Admin Panel</div>
            <div class="item">Profile</div>
            <div class="item">Logout</div>
          </div>
        </div>
      </div>
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
  constructor() {}

  ngOnInit() {
    this.token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
  }
}
