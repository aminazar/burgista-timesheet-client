/**
 * Created by Amin on 27/09/2016.
 */
import {Injectable, OnInit, state} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { LoginService } from "./login.service";

@Injectable()
export class LoggedInGuard implements CanActivate{
    private isLoggedIn=false;

    constructor(private loginService: LoginService,private router: Router){
        loginService.isLoggedIn$.subscribe((val:boolean)=>
            this.isLoggedIn=val);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        return this.isLoggedIn;
        // if(!localStorage.getItem(this.loginService.auth_key))
        // {
        //     localStorage.setItem(this.loginService.originBeforeLogin, state.url);
        //     this.router.navigate(['/login']);
        //     return false;
        // }
        // else
        //     return true;
    }
}