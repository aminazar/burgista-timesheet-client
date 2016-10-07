import {Component, OnInit, Input} from '@angular/core';
import {RestService} from "../rest.service";
import * as moment from 'moment';
import {Worktime} from "./worktime.model";

@Component({
  selector: 'app-branch-timesheet',
  templateUrl: './branch-timesheet.component.html',
  styleUrls: ['./branch-timesheet.component.css']
})
export class BranchTimesheetComponent implements OnInit {
  public isLocked:Boolean;
  public lockedBy:string;
  public lockedAt:string;
  public items:Array<Worktime> = new Array<Worktime>();
  private _date;
  @Input() bid;
  @Input() name;
  @Input()
  set date(d){
    this._date=d;
    this.items = new Array<Worktime>();
    this.ngOnInit();
  }
  get date(){
    return this._date;
  };

  constructor(private restService :RestService) { }

  getSubtitle(){
    return 'On ' + moment(this.date).format("dddd, MMMM Do YYYY")
  }

  lock(){
    this.restService.get('lock/'+ this.bid )
      .subscribe(
        (data)=>{
          console.log(data);
          this.isLocked = true;
          this.lockedBy = 'You';
          this.lockedAt = moment().format('HH:mm');
        },
        (err)=>console.log(err)
      )
  }

  ngOnInit() {
    this.restService.get('islocked/' + this.bid)
      .subscribe(
        (data:any) => {
          if(data){
            this.isLocked = true;
            this.lockedBy = data.id;
            this.lockedAt = moment(data.ltime).format('HH:mm');
          }
          else {
            this.isLocked = false;
          }
        }
      );
    this.restService.get('t/'+this.bid+'/'+moment(this.date).toISOString())
      .subscribe(
        (data:any)=>{
          for(var i in data){
            var wt = new Worktime(data[i]);
            this.items.push(wt);
          }
        }
      )
  }

}
