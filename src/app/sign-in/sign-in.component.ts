import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  errorMessage;
  constructor(public dataService: DataService, public router: Router) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log(form.controls);
    const email = form.value['email'];
    const password = form.value['password'];

    this.dataService.login({ email, password }).subscribe(
      (data: any) => {
        localStorage.setItem('token', data.response.token);
        this.router.navigate(['/chat']);
      },
      error => {
        if (error.status == 0) {
          this.errorMessage = "There might be a problem with the server, try again later!"
          return;
        };
        if(error.error && error.error.message == 'Could not find user') {
          this.errorMessage = "This is not a valid user!";
        }
      }
    );
  }
}
