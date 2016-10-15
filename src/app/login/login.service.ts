import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import { Subject } from "rxjs/Rx";

@Injectable()
export class LoginService {

  public auth_key = 'username';
  public originBeforeLogin = '/';
  public isLoggedInSource = new Subject<boolean>();
  public isLoggedIn$ = this.isLoggedInSource.asObservable();
  private refresher;

  constructor(private http:Http) {
    this.isLoggedInSource.next( !!localStorage.getItem(this.auth_key) );
    this.refresh().subscribe((res)=>console.log('refreshed login service: ', res));
  }

  sendData(user: any){
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //TODO: change server address

    return this.http
        .post(
            '/login',
            JSON.stringify(user),
            { headers }
        )
        .map(res => res.status)
        .map((res) => {
          if (res===200) {
            localStorage.setItem(this.auth_key, user.username);
            this.isLoggedInSource.next(true);
            this.refresher = setInterval(() => this.refresh().subscribe((res)=>console.log('login refresh result ', res)),60000);
          }
          return res;
        });
  }

  logout(){
    return this.http.get('/logout')
        .map((data: Response) => data.status)
        .map((res)=>{
          if(res==200){
            localStorage.removeItem(this.auth_key);
            this.isLoggedInSource.next( false );
            clearInterval(this.refresher);
          }
          return res;
        });
  }

  refresh(){
    return this.http.get('/session')
        .map((res: Response) => res.json())
        .map((res)=> {
          if (!res.user) {
              localStorage.removeItem(this.auth_key);
              this.isLoggedInSource.next(false);
          }
          else{
              localStorage.setItem(this.auth_key,res.user);
              this.isLoggedInSource.next(true);
          }
          return res;
        });
  }
}
