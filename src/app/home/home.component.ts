import {Component, OnInit} from '@angular/core';
import { LoginService } from "../login/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit{
  constructor(public router: Router ) {}

  ngOnInit(){
    this.router.navigate(['timesheet']);
  }

}
