import { Component } from '@angular/core';
import { LoginService } from "../login/login.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  private isLoggedIn = false;

  constructor(private loginService: LoginService) {
    loginService.isLoggedIn$.subscribe((val:boolean)=>{
      this.isLoggedIn=val;
    });
  }


}
