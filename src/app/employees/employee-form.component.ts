import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Employee} from "./employee.model";
import * as moment from 'moment';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  @Input() value:Employee = new Employee({});
  @Input() updateEnabled:boolean;
  @Input() deleteEnabled:boolean;
  @Input() isNew;
  @Input() isExpired;
  private _updateCount:number;
  private today = new Date();
  private subtitle="";

  @Input()
  set updateCount(count:number){//for every successful update in db, we update local copy
    Object.assign( this.copy, this.value );
    this._updateCount = count;
  }
  get updateCount(){return this._updateCount}

  private nameLength = 40;
  public buttonType:string;
  private copy:Employee = new Employee({});

  @Output() add : EventEmitter<Employee> = new EventEmitter<Employee>();
  @Output() update : EventEmitter<Employee> = new EventEmitter<Employee>();
  @Output() delete : EventEmitter<number> = new EventEmitter<number>();
  @Output() updatable : EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() addable : EventEmitter<boolean> = new EventEmitter<boolean>()


  constructor() {
  }

  action(){
    if(this.isNew)
      this.add.emit(this.value);
    else
      this.update.emit(this.value);
  }

  remove(){
    this.delete.emit(this.value.eid);
  }

  ngOnInit() {
    this.buttonType = this.isNew ? 'fa-plus' : 'fa-check';
    this.subtitle = this.isExpired?'Expired Contract':'Started ' + moment(this.value.contractDate).fromNow();
    Object.assign( this.copy, this.value );
    this.calcSubtitle();
  }

  onChange(){
    if(this.isNew)
      this.addable.emit(this.value.firstname.length>0 && parseFloat(this.value.rate)>0)
    else
      this.updatable.emit(!this.copy.isEqual(this.value) );

    this.calcSubtitle();
  }

  calcSubtitle() {
    this.subtitle = this.isExpired ? 'Expired Contract' : 'Started ' + moment(this.value.contractDate).fromNow();
  }
  onStartDateSelect(date){
    this.value.contractDate=date;
    this.onChange();
  }

  onEndDateSelect(date){
    this.value.contractEnd=date;
    this.onChange();
  }

}
