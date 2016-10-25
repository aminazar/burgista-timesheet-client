import {TimePair} from "./time.model";
import * as moment from 'moment';

/**
 * Created by Amin on 24/10/2016.
 */
export class Interval{
  private _start:TimePair;
  private _end:TimePair;
  public date:Date;

  constructor(d:Date){
    this.date   = d;
    this._start = new TimePair();
    this._end   = new TimePair();
  }

  get nextDay(){
    return this._end.nextDay;
  }

  set nextDay(value:boolean){
    this._end.nextDay = value;
  }

  set start(s:TimePair){
    this._start = s;
    this._start.infinity=!(s.minutes&&s.hours);
    if(!s.infinity){
      if(this._end.infinity) {
        this._end.infinity = false;
        this._end.hours = s.hours;
        this._end.minutes = s.minutes;
        if (this._end.hours > 23)
          this._end.hours %= 24;
      }

      if(this._end.hours * 60 + this._end.minutes * 1 < s.hours * 60 + s.minutes * 1){
        this.nextDay = true;
      }
      else{
        this.nextDay = false;
      }
    }
  }

  get start(){
    return this._start;
  }

  set end(e:TimePair){
    this._end = e;
    this._end.infinity=!(e.minutes&&e.hours);
    if(!e.infinity){
      if(this._start.infinity) {
        this._start.infinity = false;
        this._start.hours = e.hours - 8;
        this._start.minutes = e.minutes;
        if(this._start.hours < 0)
          this._start.hours += 24;
      }

      if(this._start.hours * 60 + this._start.minutes * 1 > e.hours * 60 + e.minutes * 1){
        this.nextDay = true;
      }
      else{
        this.nextDay = false;
      }
    }
  }

  get end(){
    return this._end;
  }

  set startDateTime(d){
    if(moment(d).isValid()) {
      if (moment(d).date() != moment(this.date).date())
        throw('Error beginning of interval: ' + d + ' does not match context date: ' + this.date);
    }
    this._start.fromDate(moment(d).toDate());
  }

  get startDateTime(){
    return this._start.toFormattedDate(this.date);
  }

  set endDateTime(d){
    if(moment(d).isValid()) {
      var diff = moment.utc(d).diff(moment.utc(this.date), 'days');
      if (diff > 1 || diff < 0)
        throw('Error end of interval: ' + d + ' does not match context date: ' + this.date);
    }
    this._end.fromDate(moment(d).toDate());
  }

  get endDateTime(){
    return this._end.toFormattedDate(this.date);
  }

  duration(){
    if(this.endDateTime && this.startDateTime) {
      var d = moment(this.endDateTime).diff(moment(this.startDateTime), 'hours', true);
      if(!isNaN(d))
        return Math.floor(d) + 'hrs ' + Math.round((d - Math.floor(d)) * 60) + ' mins';
      return '';
    }
    else return '';
  }
  toObject(nobreaks:boolean){
    var obj = {
      start:    this.startDateTime,
      end:      this.endDateTime,
      nobreaks: nobreaks,
    }

    return obj;
  }
}