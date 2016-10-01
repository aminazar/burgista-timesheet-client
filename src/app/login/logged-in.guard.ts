/**
 * Created by Amin on 27/09/2016.
 */
import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { LoginService } from "./login.service";

@Injectable()
export class LoggedInGuard implements CanActivate{

    constructor(private loginService: LoginService,private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        if(!localStorage.getItem(this.loginService.auth_key))
        {
            localStorage.setItem(this.loginService.originBeforeLogin, state.url);
            this.router.navigate(['/login']);
            return false;
        }
        else
            return true;
    }

}