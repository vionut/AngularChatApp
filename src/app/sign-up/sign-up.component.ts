import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  constructor(public dataService: DataService, public router: Router) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log(form.controls);
    const user = {
      firstName: form.controls['firstName'],
      lastName: form.controls['lastName'],
      email: form.controls['email'],
      password: form.controls['password']
    };
    this.dataService.register(user).subscribe(
      (data: any) => {
        localStorage.setItem('token', data.response.token);
        this.router.navigate(['/chat']);
      },
      error => {
        console.log(error);
      }
    );
  }
}
