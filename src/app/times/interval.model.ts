import {TimePair} from "./time.model";
import * as moment from 'moment';

/**
 * Created by Amin on 24/10/2016.
 */
export class Interval{
  private _start:TimePair;
  private _end:TimePair;
  public date:Date;
  public breakMinutes:number;
  public _nobreak:boolean;

  constructor(){
    this._start = new TimePair();
    this._end   = new TimePair();
    this.breakMinutes = 0;
    this._nobreak = false;
  }

  get nextDay(){
    return this._end.nextDay;
  }

  set nextDay(value:boolean){
    this._end.nextDay = value;
  }

  get nobreak(){
    return this._nobreak;
  }

  set nobreak(nb){
      this._nobreak= nb;
      this.setBreaktime();
  }

  set start(s:TimePair){
    this._start = s;
    this._start.infinity=!(s.minutes&&s.hours);
    if(!s.infinity){
      if(this._end.infinity) {
        this._end.infinity = false;
        this._end.hours = s.hours;
        this._end.minutes = s.minutes;
      }

      if(this._end.hours * 60 + this._end.minutes * 1 < s.hours * 60 + s.minutes * 1){
        this.nextDay = true;
      }
      else{
        this.nextDay = false;
      }
    }
    this.setBreaktime();
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
        this._start.hours = e.hours;
        this._start.minutes = e.minutes;
      }

      if(this._start.hours * 60 + this._start.minutes * 1 > e.hours * 60 + e.minutes * 1){
        this.nextDay = true;
      }
      else{
        this.nextDay = false;
      }
    }
    this.setBreaktime();
  }

  setBreaktime(){
    if(!this._start.infinity && !this._end.infinity && !this.nobreak) {
      var d = moment(this.endDateTime).diff(moment(this.startDateTime), 'hours', true);

      this.breakMinutes = (d>6)?30:(d>4)?20:0;
    }
    else{
      this.breakMinutes = 0;
    }
  }
  get end(){
    return this._end;
  }

  set startDateTime(d){
    if(moment(d).isValid()) {
      if (moment(d).date() !== moment(this.date).date())
        throw('Error beginning of interval: ' + d + ' does not match context date: ' + this.date);
    }
    this._start.fromDate(moment(d).toDate());
  }

  get startDateTime(){
    return this._start.toFormattedDate(this.date);
  }

  set endDateTime(d){
    if(moment(d).isValid()) {
      var diff = moment(moment(d).format('YYYY-MM-DD')).diff(moment(moment(this.date).format('YYYY-MM-DD')), 'days');
      if (diff > 1 || diff < 0)
        throw('Error end of interval: ' + d + ' does not match context date: ' + this.date);
    }
    this._end.fromDate(moment(d).toDate());
    if(diff===1)
      this._end.nextDay = true;
  }

  get endDateTime(){
    return this._end.toFormattedDate(this.date);
  }

  toString(){
    return moment(this.startDateTime).format('HH:mm') + ' to ' + moment(this.endDateTime).format('HH:mm');
  }

  duration(){
    if(this.endDateTime && this.startDateTime) {
      var d = moment(this.endDateTime).diff(moment(this.startDateTime), 'hours', true) - this.breakMinutes/60;
      if(!isNaN(d))
        return Math.floor(d) + 'hrs ' + Math.round((d - Math.floor(d)) * 60) + ' mins' + ( (this.breakMinutes)? ' ('+this.breakMinutes+'mins break)' : '' );
      return '';
    }
    else return '';
  }
  toObject(){
    var minuteDiff = moment(this.endDateTime).diff(moment(this.startDateTime),'minutes');
    if(minuteDiff<0)
      throw('invalid interval: start is ' + (-minuteDiff) + ' after end');
201
    var obj = {
      start:    this.startDateTime,
      end:      this.endDateTime,
      nobreaks: this.nobreak,
    }

    return obj;
  }

  clone(){
    var c = new Interval();
    c.date = this.date;
    c._nobreak = this._nobreak;
    c.breakMinutes = this.breakMinutes;
    var self = this;
    ['_start','_end'].forEach(function(el){
      ['hours','minutes','nextDay','infinity'].forEach(function(prop){
        c[el][prop]=self[el][prop];
      })
    });

    return c;
  }
}