import { Component } from '@angular/core';
import { LoginService } from "../login/login.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent{
  private user;
  private isLoggedIn = false;

  constructor(private loginService: LoginService, public router: Router) {
    loginService.isLoggedIn$.subscribe((val:boolean)=>{
      this.isLoggedIn=val;
      if(val)
        this.user = localStorage.getItem(loginService.auth_key);
    });
  }
  logout() {
    localStorage.removeItem(this.loginService.auth_key);
    this.router.navigate(['/login']);
    this.loginService.logout().subscribe((val:any)=>{console.log('logoout',val)},(err:any)=>{console.log('logout error', err)});
  }
}
