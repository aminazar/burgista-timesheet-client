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
    this.infinity = true;
    this.nextDay  = false;
  }

  toFormattedDate(date:Date){
    if(this.infinity)
      return('infinity');

    return moment(date).hours(this.hours).minutes(this.minutes).add(this.nextDay?1:0,'d').format('YYYY-MM-DDTHH:mm:00');
  }

  fromDate(date:Date){
    if(!moment(date).isValid())
      this.infinity=true;
    else{
      this.hours=moment(date).hours();
      this.minutes=moment(date).minutes();
      this.infinity=false;
    }
  }

  toString(el='hours'){
    if(!this.infinity)
      return (''+this[el]).length<2?'0'+this[el]:''+this[el];
    return '';
  }

  now(){
    this.infinity=false;
    this.minutes=moment().minutes();
    this.hours=moment().hours();
  }
}
