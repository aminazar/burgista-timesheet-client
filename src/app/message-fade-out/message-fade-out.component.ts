import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-message-fade-out',
  templateUrl: './message-fade-out.component.html',
  styleUrls: ['./message-fade-out.component.css']
})
export class MessageFadeOutComponent{
  private opacity=0;
  private transition="";
  private height = '0px';
  private borderColor:any = null;
  private _message="";
  private _bgClass="";
  private timeout;

  constructor() { }

  @Input()
  set bgClass(c){
    this._bgClass = c;
  }
  get bgClass(){
    return this._bgClass;
  }

  @Input()
  set message(msg){
    this._message = msg;

    this.opacity = 1;
    this.height='auto';
    this.transition = 'border-color ' + .3 +'s ease-out';
    var i = 1;
    var flashBorder = setInterval(()=> {
      this.borderColor = (i % 2) ? null : 'darkred';
      i++;
    },400);

    setTimeout(()=>{
      clearInterval(flashBorder);
    },5000);

    if(this.timeout)
      clearTimeout(this.timeout);

    this.timeout = setTimeout(()=>{

      this.transition='opacity ' + (msg.length*.05).toString() +'s ease-out';

      this.opacity=0;
      },msg.length * 250 );
  }
  get message(){
    return this._message;
  }
}
