import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
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


  delete(table, id){
    return this.http.delete('/api/' + table + '/' + id );
  }

  update(table, id, values){
    return this.http.post('/api/' + table + '/' + id, values )
  }
}
