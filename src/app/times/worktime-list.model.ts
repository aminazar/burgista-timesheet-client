/**
 * Created by Amin on 24/10/2016.
 */

import { Interval } from "./interval.model";
import { RestService } from "../rest.service";
import * as moment from 'moment';
import {TimePair} from "./time.model";
import {Response} from "@angular/http";

export class WorktimeList{
  public items = {};
  public beingEdited = {};
  private copy = {};
  private _message="";

  get message(){
    return this._message;
  }

  set message(m){
    if(m===this._message)
      m+=' ';
    this._message = m;
  }
  constructor(private date:Date, private bid:any, private restService:RestService){};

  get toArray(){
    var ret = [];
    Object.keys(this.items).forEach((key)=>{
      let obj = this.items[key];
      obj.eid = key;
      ret.push(obj);
    });
    return ret;
  }

  load(employeeWorktime){
    var i = new Interval();
    i.date = this.date;

    if(employeeWorktime.wtid){
      i.startDateTime = employeeWorktime.start_time;
      i.endDateTime   = employeeWorktime.end_time;
      i.breakMinutes  = employeeWorktime.breaktime?employeeWorktime.breaktime:0;
      i.nobreak       = Boolean(employeeWorktime.nobreak);
      i.by            = employeeWorktime.updated_by;
    }

    if(this.items[employeeWorktime.eid]){
      if(employeeWorktime.wtid) {
        this.copy[employeeWorktime.wtid] = i;
        this.items[employeeWorktime.eid].worktimes[employeeWorktime.wtid] = i;
        this.beingEdited[employeeWorktime.eid][employeeWorktime.wtid]=false;
      }
    }
    else{
      let obj = {};
      this.beingEdited[employeeWorktime.eid] = {};
      if(employeeWorktime.wtid) {
        obj[employeeWorktime.wtid] = i;
        this.beingEdited[employeeWorktime.eid][employeeWorktime.wtid]=false;
      }

      this.items[employeeWorktime.eid] = {
        worktimes:  obj,
        name:       employeeWorktime.firstname + ' ' + employeeWorktime.surname,
        nobreak:    Boolean(employeeWorktime.nobreak),
      }
    }
  }

  add(eid,wt:Interval){
      var worktime = wt.clone();

      this.restService.insert('t/' + this.bid + '/' + eid, worktime.toObject())
        .subscribe(
          (wtid:any)=>{
            worktime.by='You';
            this.items[eid].worktimes[wtid.json()]=worktime;
            wt.start=new TimePair();
            wt.end=new TimePair();
          },
          (err:Response)=>{
            this.message = err.text();
            console.log('error while adding worktime:',err);
          }
        );


  }

  update(eid,wtid,i){
    this.restService.update('t', wtid, i.toObject())
      .subscribe(
        ()=>{
          console.log('worktime ' + wtid + 'updated');
          i.by='You';
          this.copy[wtid]=i;
          this.items[eid].worktimes[wtid] = i;
        },
        (err:Response)=>{
          this.items[eid].worktimes[wtid]=this.copy[wtid];
          this.beingEdited[eid][wtid]=false;
          this.message=err.text();
          console.log('error while updaing worktime:',err);
        }
    );
  }
  

  delete(eid,wtid){
    this.restService.delete('t', wtid)
      .subscribe(
        ()=>{
          delete this.items[eid].worktimes[wtid];
          delete this.copy[wtid];
        },
        (err:Response)=>{
          this.message=err.text();
          console.log('error while deleting worktime:', err);
        }
    );
  }
}
