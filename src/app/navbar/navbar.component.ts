import { Component, OnInit } from '@angular/core';
import {LoginService} from "../login/login.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [LoginService]
})
export class NavbarComponent implements OnInit {
  private user;

  constructor(private loginService: LoginService) {}


  ngOnInit() {
    this.loginService.getUser()
        .subscribe(
            (data: any )=> { console.log(data); this.user = data }
        );
  }

}
