/**
 * Created by Amin on 27/09/2016.
 */
import {Injectable, OnInit, state} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { LoginService } from "./login.service";
import {log} from "typings/dist/support/cli";

@Injectable()
export class LoggedInGuard implements CanActivate{
    //public isLoggedIn=false;
    private _isLoggedIn=false;
    set isLoggedIn(val:boolean){
        this._isLoggedIn=val;
    }
    get isLoggedIn(){
        return this._isLoggedIn;
    }

    constructor(private loginService: LoginService,private router: Router){
        loginService.isLoggedIn$.subscribe(
          (val:boolean)=>
            {this.isLoggedIn=val;console.log('guard is-logged-in:',val);},
          (err:any)=>console.log(err));
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        var self=this;
        if(!this.isLoggedIn) {
            self.loginService.originBeforeLogin = state.url;
            this.router.navigate(['login']);
        }
        return this.isLoggedIn;
    }
}