import {Component, OnInit, Input} from '@angular/core';
import {Worktime} from "./worktime.model";
import {RestService} from "../rest.service";

@Component({
  selector: 'app-worktime',
  templateUrl: './worktime.component.html',
  styleUrls: ['./worktime.component.css']
})
export class WorktimeComponent implements OnInit {
  @Input() value:Worktime;
  @Input() bid;
  @Input() date;
  private isRunning:boolean;

  constructor(private restService :RestService) { }

  play(timer){
    this.value.startTime.now();
    this.restService.insert('t/' + this.bid + '/' + this.value.eid, this.value.toObject(this.date))
      .subscribe(
        (data)=>{
          timer.onNow();
          timer.isRunning=true;
          this.value.wtid=data.json();
          this.isRunning=true;
        },
        (err)=>{console.log(err);
          this.isRunning=false;
          this.value.startTime.infinity=true;
        }
      )
  }

  stop(timer){
    this.value.endTime.now();

    this.restService.update('t', this.value.wtid, this.value.toObject(this.date))
      .subscribe(
        (data)=>{
          timer.onNow();
          this.isRunning=false;
        },
      (err)=>{
        console.log(err);
        this.isRunning=true;
        this.value.endTime.infinity=true;
      }
      )
  }

  remove(){
    this.restService.delete('/t', this.value.wtid)
      .subscribe(
        (data)=>{
          this.isRunning=false;
          this.value.wtid=NaN;
        }
      )
  }

  ngOnInit() {
    this.isRunning=!this.value.startTime.infinity&&this.value.endTime.infinity;
  }

}
