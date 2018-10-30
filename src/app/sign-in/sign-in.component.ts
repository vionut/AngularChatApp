import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angular-6-social-login';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  errorMessage;
  constructor(
    public dataService: DataService,
    public router: Router,
    private socialAuthService: AuthService
  ) {}

  ngOnInit() {}

  socialSignIn(platform: string) {
    let socialPlatformProvider;
    if (platform == 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (platform == 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      user => {
        console.log(user);
        localStorage.setItem('socialToken', user.token);
        localStorage.setItem('socialId', user.id);
        this.dataService._tokenChanged.next(true);
        console.log(localStorage);
        this.router.navigate(['/chat']);
      } 
    );
  }

  onSubmit(form: NgForm) {
    console.log(form.controls);
    const email = form.value['email'];
    const password = form.value['password'];

    this.dataService.login({ email, password }).subscribe(
      (data: any) => {
        localStorage.setItem('token', data.response.token);
        this.dataService._tokenChanged.next(true);
        this.router.navigate(['/chat']);
      },
      error => {
        if (error.status == 0) {
          this.errorMessage = 'There might be a problem with the server, try again later!';
          return;
        }
        if (error.error && error.error.message == 'Could not find user') {
          this.errorMessage = 'This is not a valid user!';
        }
      }
    );
  }
}
