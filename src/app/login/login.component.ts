import {Component, OnInit} from '@angular/core';
import { NgForm } from "@angular/forms";
import {LoginService} from "./login.service";

@Component({
  moduleId: module.id,
  selector: 'burgista-ts-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit{
  constructor(private loginService : LoginService){}
  user = {
    username: '',
    password: '',
    forget: false
  };
  onSubmit(loginForm: NgForm) {
    this.loginService.sendData(this.user)
      .subscribe(
        function(data){
          console.log(data);
        }
      );
  }
  makeForgetFalse(){
    this.user.forget=false;
  }

  ngOnInit(){}
}
