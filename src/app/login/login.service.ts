import { Injectable } from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class LoginService {

  constructor(private http:Http) { }

  sendData(user: any){
    const body = JSON.stringify(user);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //TODO: change server address
    return this.http.post('http://localhost:3000/login', body, {headers: headers}).map((data: Response) => { console.log(data); return data.json });
  }

  getUser(){
    const headers = new Headers();
    //TODO: change server address
    return this.http.get('http://localhost:3000/session').map((data: Response)=> data.json());
  }

}
