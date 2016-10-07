import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {TimePair} from "./time.model";
import * as moment from 'moment';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit{
  @Input() isRunning:boolean;
  @Input() value:TimePair;
  private h1:number;
  private h2:number;
  private m1:number;
  private m2:number;
  @Output('change') nowChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }
  onNow(){
    var hours = moment().hours();
    var minutes= moment().minutes();
    this.h1 = Math.floor(hours/10);
    this.h2 = hours%10;
    this.m1 = Math.floor(minutes/10);
    this.m2 = minutes%10;
    this.nowChange.emit(true);
  }
  hours(){
    return this.h1*10 + this.h2;
  }
  minutes(){
    return this.m1*10 + this.m2;
  }
  ngOnInit() {
    this.h1 = Math.floor(this.value.hours/10);
    this.h2 = this.value.hours%10;
    this.m1 = Math.floor(this.value.minutes/10);
    this.m2 = this.value.minutes%10;
  }
}
