import {Component, OnInit, Input} from '@angular/core';
import {RestService} from "../rest.service";
import * as moment from 'moment';
import {WorktimeList} from "./worktime-list.model";
import {Interval} from "./interval.model";

@Component({
  selector: 'app-branch-timesheet',
  templateUrl: './branch-timesheet.component.html',
  styleUrls: ['./branch-timesheet.component.css']
})
export class BranchTimesheetComponent implements OnInit {
  public isLocked:Boolean;
  public lockedBy:string;
  public lockedAt:string;
  public list:WorktimeList;
  public addedEmp:any = "";
  public addedEmpNoBreaks = false;
  private _date;
  @Input() bid;
  @Input() name;
  @Input()
  set date(d){
    this._date=d;
    this.list = new WorktimeList(d,this.bid,this.restService);;
    this.ngOnInit();
  }
  get date(){
    return this._date;
  };

  get vacantEmps(){
    return Object.keys(this.list.items).filter(e=>!Object.keys(this.list.items[e].worktimes).length).map(k=>{return {id:k,value:this.list.items[k].name}});
  }
  get engagedEmps(){
    return Object.keys(this.list.items).filter(e=>Object.keys(this.list.items[e].worktimes).length);
  }

  workTimeIDs(eid){
    return Object.keys(this.list.items[eid].worktimes);
  }

  addNew(i:Interval){
    if(this.addedEmp.id){
      this.list.add(this.addedEmp.id,i,!this.addedEmpNoBreaks);
      this.addedEmp="";
    }
  }

  constructor(private restService :RestService) {
    this.list = new WorktimeList(this.date,this.bid,this.restService);
  }

  getSubtitle(){
    return 'On ' + moment(this.date).format("dddd, MMMM Do YYYY")
  }

  changeBreakType(eid){
    this.list.changeBreak(eid);
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
          if(data && data.id){
            this.isLocked = true;
            this.lockedBy = data.id;
            this.lockedAt = moment(data.ltime).format('HH:mm');
          }
          else {
            this.isLocked = false;
          }
        }
      );
    this.restService.get('t/'+this.bid+'/'+moment(this.date).format('YYYY-MM-DD'))
      .subscribe(
        (data:Array<any>)=>{
            for(var i in data)
              this.list.load(data[i]);
        },
        (err)=>{console.log('error in loading worktimes:',err)}
      );
  }
}
