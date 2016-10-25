import { Component } from '@angular/core';
import { LoginService } from "./login.service";
import { Response } from "@angular/http";
import { Router } from "@angular/router";

@Component({
  selector: 'burgista-ts-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent{
  public message='';
  public errMessage ='';
  constructor(private loginService : LoginService, private router:Router){}
  user = {
    username: '',
    password: '',
    forget: false
  };
   onSubmit() {
    this.loginService.sendData(this.user).subscribe(
        (data:any)=>{
          if(data===200) {
            let url = this.loginService.originBeforeLogin;
            console.log('routing to:', url);
            this.router.navigate([url!==null ? url : '']);
          }
          else
            this.message = 'A link to reset your password is sent to your email.'
        },
        (err:Response)=>this.errMessage=err.statusText);
  }

  makeForgetFalse(){
    this.user.forget=false;
  }

}
