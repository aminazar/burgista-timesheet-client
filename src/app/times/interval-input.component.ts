import {Component, OnInit, Output, Input, EventEmitter, ViewChild} from '@angular/core';
import {TimePair} from "./time.model";
import {Interval} from "./interval.model";

@Component({
  selector: 'app-interval-input',
  templateUrl: './interval-input.component.html',
  styleUrls: ['./interval-input.component.css']
})
export class IntervalInputComponent implements OnInit {
  private _i:Interval;
  private copy:Interval;
  @Input() btnName = "add";
  @Input() beingEdited = false;
  @Input('initValue')

  get initVal(){
    return this._i;
  }

  set initVal(i:Interval){
    this._i = i;
    this.copy = i;
  }
  @Output() vChange:EventEmitter<Interval> = new EventEmitter<Interval>();
  @Output() edited:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleted:EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() date;
  @ViewChild('hi1') hi1;
  @ViewChild('mi1') mi1;
  @ViewChild('hi2') hi2;
  @ViewChild('mi2') mi2;

  constructor(){
    this._i = new Interval(this.date);
    this.copy = new Interval(this.date);
  }

  go(event,n){
    var ref = [this.hi1, this.mi1, this.hi2, this.mi2];
    if(event.keyCode===9&&!event.shiftKey)//tab
      return;

    if(!(event.shiftKey && event.keyCode === 9)&&event.keyCode!==37) {//not shift+tab or left arrow
      if (ref[n - 1].nativeElement.value.length === 2) {
        var newTP = new TimePair();
        newTP.hours = (n < 3 ? this.hi1 : this.hi2).nativeElement.value;
        newTP.minutes = (n < 3 ? this.mi1 : this.mi2).nativeElement.value;
        this._i[n < 3 ? 'start' : 'end'] = newTP;
        if (ref[n])
          ref[n].nativeElement.focus();
      }
    }
    else{//shift+tab or left arrow
      if(n>1)
        ref[n-2].nativeElement.focus();
    }
  }

  check(i){
    [this._i.start.hours,this._i.end.hours].forEach(el=>{if(el<0 || el > 23){i.focus()}});
    [this._i.start.minutes,this._i.end.minutes].forEach(el=>{if(el<0 || el > 59){i.focus()}});
  }

  add(){
    this.vChange.emit(this._i);
  }

  editStart(){
    this.beingEdited = true;
    this.edited.emit(true);
  }

  delete(){
    this.deleted.emit(true);
  }
  ngOnInit() {
  }

}
