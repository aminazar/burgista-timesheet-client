/**
 * Created by Amin on 24/10/2016.
 */

import { Interval } from "./interval.model";
import { RestService } from "../rest.service";
import * as moment from 'moment';
import {TimePair} from "./time.model";

export class WorktimeList{
  public items = {};
  public beingEdited = {};
  private copy = {};
  
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

  add(eid,wt:Interval,noBreak = this.items[eid].nobreak){
    var self = this;

    var addCallback = function(){
      var worktime = wt.clone();

      self.restService.insert('t/' + self.bid + '/' + eid, worktime.toObject(noBreak))
        .subscribe(
          (wtid:any)=>{
            self.items[eid].worktimes[wtid]=worktime;
            wt.start=new TimePair();
            wt.end=new TimePair();
          },
          (err)=>{
            console.log('error while adding worktime:',err);
          }
        );
    }

    var formattedDate = moment(this.date).format('YYYY-MM-DD');
    if(noBreak)
      this.restService.insert('nobreak',{eid: eid, date:formattedDate, bid: this.bid}).subscribe(()=>{console.log('nobreak added');addCallback()});
    else
      this.restService.delete('nobreak/' + formattedDate + '/' + this.bid,eid).subscribe(()=>{console.log('nobreak deleted');addCallback()})

  }

  update(eid,wtid,i){
    this.restService.update('t', wtid, i.toObject(this.items[eid].nobreak))
      .subscribe(
        ()=>{
          console.log('worktime ' + wtid + 'updated');
          this.copy[wtid]=i;
          this.items[eid].worktimes[wtid] = i;
        },
        (err)=>{
          this.items[eid].worktimes[wtid]=this.copy[wtid];
          this.beingEdited[eid][wtid]=false;
          console.log('error while updaing worktime:',err);
        }
    );
  }

  changeBreak(eid){
    var formattedDate = moment(this.date).format('YYYY-MM-DD');
    var self = this;
    var callback = function(){
      for(var wtid in self.items[eid].worktimes) {
        self.update(eid, wtid, self.items[eid].worktimes[wtid]);
      }
    }

    if(this.items[eid].nobreak)
      this.restService.insert('nobreak',{eid: eid, date:formattedDate, bid: this.bid}).subscribe(()=>{console.log('nobreak added');callback();});
    else
      this.restService.delete('nobreak/' + formattedDate + '/' + this.bid,eid).subscribe(()=>{console.log('nobreak deleted');callback();})
  }

  delete(eid,wtid){
    this.restService.delete('t', wtid)
      .subscribe(
        ()=>{
          delete this.items[eid].worktimes[wtid];
          delete this.copy[wtid];
        },
        (err)=>{
          console.log('error while deleting worktime:', err);
        }
    );
  }
}
