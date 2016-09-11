import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";

@Component({
  moduleId: module.id,
  selector: 'bergista-ts-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {
  user = {
    username: '',
    password: '',
    remember: false,
    forget: false
  };
  onSubmit(loginForm: NgForm) {
    console.log(this.user);

  }
  makeForgetFalse(){
    this.user.forget=false;
  }
}
