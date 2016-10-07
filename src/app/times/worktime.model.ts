/*
 * Created by Amin on 06/10/2016.
 */
import * as moment from 'moment';
import {TimePair} from "./time.model";

export class Worktime{
  public eid:number;
  public firstname:string;
  public surname:string;
  public startTime:TimePair = new TimePair();
  public endTime:TimePair = new TimePair();
  public wtid:number;
  public user:string;
  public breaktime:number;

  constructor(obj:any){
    this.firstname = obj.firstname;
    this.surname   = obj.surname;
    this.startTime.fromDate(moment(obj.start_time).toDate());
    this.endTime.fromDate(moment(obj.end_time).toDate());
    this.wtid = obj.wtid?obj.wtid:NaN;
    this.breaktime = obj.breaktime?obj.breaktime:NaN;
    this.user=obj.id?obj.id:'';
    this.eid=obj.eid?obj.eid:NaN;
    this.wtid=obj.wtid?obj.wtid:NaN;
  }

  getBreakTime(baseDate){
    if(this.getTimeWorked(baseDate).hours>=6){
      return 30
    }
    else return 20;
  }

  getTimeWorked(baseDate){
    var obj = this.toObject(baseDate);
    var end = this.endTime.infinity ? new Date():obj.end;
    var hours = moment(end).diff(moment(obj.start),'hours');
    if(hours<0)
      hours+=24;
    var minutes = moment(end).diff(moment(obj.start),'minutes') - hours * 60;
    return {hours:hours,minutes:minutes};
  }

  getTimeWorkedStr(baseDate){
    var v=this.getTimeWorked(baseDate);
    return v.hours + 'h '+v.minutes + 'm';
  }

  toObject(baseDate){
    this.endTime.nextDay = !this.endTime.infinity && this.endTime.hours < this.startTime.hours;
    return {
      wtid: this.wtid,
      start: this.startTime.toFormattedDate(baseDate),
      end:   this.endTime.toFormattedDate(baseDate),
    }
  }
}