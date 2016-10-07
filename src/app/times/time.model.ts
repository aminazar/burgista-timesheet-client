/**
 * Created by Amin on 06/10/2016.
 */
import * as moment from 'moment';

export class TimePair{
  public hours:number;
  public minutes:number;
  public nextDay:boolean;
  public infinity:boolean;

  constructor(){
  }

  toFormattedDate(date:Date){
    if(this.infinity)
      return('infinity');

    return moment(date).hours(this.hours).minutes(this.minutes).second(0).millisecond(0).add(this.nextDay?1:0,'d').format();
  }

  fromDate(date:Date){
    if(isNaN(date.getHours()))
      this.infinity=true;
    else{
      this.hours=moment(date).hours();
      this.minutes=moment(date).minutes();
      this.infinity=false;
    }
  }

  now(){
    this.infinity=false;
    this.minutes=moment().minutes();
    this.hours=moment().hours();
  }
}
