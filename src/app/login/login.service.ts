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
    return this.http.post('http://localhost:3000/login', body, {headers: headers}).map((data: Response) =>{ console.log(data); return data.json });
  }

}
