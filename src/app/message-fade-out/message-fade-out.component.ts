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
  private _message="";
  private _bgClass="";

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
    this._message=msg;
    this.opacity = 1;
    this.height='auto';
    this.transition = 'opacity '+ (msg.length / 60.0).toString() +'s ease-out, ' +
                      'height ' + (msg.length / 60.0).toString() +'s ease-out';

    setTimeout(()=>{
      this.opacity=0;
      this.height='0px';
      this.transition='opacity ' + (msg.length / 40.0).toString() +'s ease-out, ' +
                      'height ' + (msg.length / 40.0).toString() +'s ease-out, ';

    },msg.length / .03 );
  }
  get message(){
    return this._message;
  }
}
