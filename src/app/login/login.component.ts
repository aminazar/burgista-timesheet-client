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
  //pattern = /admin|^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
  onSubmit() {
    this.loginService.sendData(this.user).subscribe(
        (data:any)=>{
          if(data===200) {
            let url = localStorage.getItem(this.loginService.originBeforeLogin);
            this.router.navigate([url ? url : '/']);
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
