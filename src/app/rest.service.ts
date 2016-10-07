import { Injectable } from '@angular/core';
import {Http, Response, URLSearchParams} from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class RestService {
  constructor(private http:Http){ }

  insert(table, values){
    return this.http.put('/api/'+table, values);
  }

  get(table){
    return this.http.get('/api/'+table).map((data: Response)=> data.json());
  };

  getWithParams(table,values){
    let params: URLSearchParams = new URLSearchParams();
    for(var key in values)
      if(values.hasOwnProperty(key))
        params.set(key,values[key]);

    return this.http.get('/api/'+table,{search: params}).map((data:Response)=>
      data.json());
  }

  delete(table, id){
    return this.http.delete('/api/' + table + '/' + id );
  }

  update(table, id, values){
    return this.http.post('/api/' + table + '/' + id, values )
  }
}
