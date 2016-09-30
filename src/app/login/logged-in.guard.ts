/**
 * Created by Amin on 27/09/2016.
 */
import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { LoginService } from "./login.service";

@Injectable()
export class LoggedInGuard implements CanActivate{

    constructor(private loginService: LoginService,private router: Router){}

    canActivate(){
        if(!localStorage.getItem(this.loginService.auth_key))
        {
            this.router.navigate(['/login']);
            return false;
        }
        else
            return true;
    }

}