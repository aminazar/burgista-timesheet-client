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
  private _nobreak:boolean;
  @Input() btnName = "add";
  @Input() beingEdited = false;
  @Input('nobreak')
  get nobreak(){
    return this._nobreak;
  }
  set nobreak(nb){
    this._nobreak=nb;
    if(this.beingEdited)//changing 'no-break' checkbox affects 'not being edited' inputs with another mechanism
      this._i.nobreak =  nb;
  }
  @Input('initValue')

  get initVal(){
    return this._i;
  }

  set initVal(i:Interval){
    this._i = i.clone();
    this.nobreak = i.nobreak;
    this._i.date = this.date;
    this.copy = i.clone();
    this.copy.date=this.date;
  }
  @Output() vChange:EventEmitter<Interval> = new EventEmitter<Interval>();
  @Output() edited:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleted:EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() date;
  @ViewChild('hi1') hi1;
  @ViewChild('mi1') mi1;
  @ViewChild('hi2') hi2;
  @ViewChild('mi2') mi2;
  @ViewChild('btn') btn;

  constructor(){
    this._i = new Interval();
    this.copy = new Interval();
  }

  go(event,n){
    var ref = [this.hi1, this.mi1, this.hi2, this.mi2, this.btn];
    if(event.keyCode===9&&!event.shiftKey)//tab
      return;

    if(!(event.shiftKey && event.keyCode === 9)&&event.keyCode!==37) {//not shift+tab or left arrow
      if (ref[n - 1].nativeElement.value.length === 2) {
        var val = parseInt(ref[n - 1].nativeElement.value);
        if(isNaN(val) || val < 0 || (!(n%2) && val > 59) || (n%2 && val > 23)) {
          ref[n - 1].nativeElement.value = '00';
          ref[n - 1].nativeElement.style.borderColor = 'red';
          setTimeout(()=>ref[n - 1].nativeElement.style.borderColor = null, 1000);
          ref[n - 1].nativeElement.focus();
          ref[n - 1].nativeElement.select();
        }
        else {
          var newTP = new TimePair();
          newTP.hours = (n < 3 ? this.hi1 : this.hi2).nativeElement.value;
          newTP.minutes = (n < 3 ? this.mi1 : this.mi2).nativeElement.value;
          this._i[n < 3 ? 'start' : 'end'] = newTP;
          if (ref[n]) {
            ref[n].nativeElement.focus();
            if(n<4)
              ref[n].nativeElement.select();
          }
        }
      }
    }
    else{//shift+tab or left arrow
      if(n>1) {
        ref[n - 2].nativeElement.focus();
        ref[n - 2].nativeElement.select();
      }
      else{
        ref[0].nativeElement.focus();
        ref[0].nativeElement.select();
      }
    }
  }

  add(){
    this._i.date = this.date;
    this.copy.date = this.date;
    if(this.btnName==='update')
      this.beingEdited=false;

    this.vChange.emit(this._i.clone());
  }

  editStart(){
    this.beingEdited = true;
    this.edited.emit(true);
  }

  editCancel(){
    if(!this.copy.start.infinity)
    this.beingEdited=false;
    this._i = this.copy.clone();
  }
  delete(){
    this.deleted.emit(true);
  }
  ngOnInit() {
    this._i.date = this.date;
    this.copy.date = this.date;
    if(this._i.start.infinity)//changing 'no-break' checkbox should only affect empty 'interval-input's - the non-empty ones will be affected by another mechanism
      this._i.nobreak =  this.nobreak;
  }

}
