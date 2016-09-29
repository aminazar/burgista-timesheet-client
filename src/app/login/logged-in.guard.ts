/**
 * Created by Amin on 27/09/2016.
 */
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoginService } from "./login.service";

@Injectable()
export class LoggedInGuard implements CanActivate{


    constructor(private loginService: LoginService){}

    canActivate(){
        return !!localStorage.getItem(this.loginService.auth_key);
    }

}