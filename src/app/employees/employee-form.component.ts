import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Employee} from "./employee.model";

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  @Input() value:Employee = new Employee({});
  @Input() isEnabled:boolean;
  @Input() isNew;

  private nameLength = 40;
  public title:string;
  public buttonType:string;

  @Output() add : EventEmitter<Employee> = new EventEmitter<Employee>();
  @Output() update : EventEmitter<Employee> = new EventEmitter<Employee>();
  @Output() delete : EventEmitter<number> = new EventEmitter<number>();

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
    this.title =  this.isNew ? 'New Employee' : this.value.surname + ', ' + this.value.firstname;
    this.buttonType = this.isNew ? 'fa-plus' : 'fa-check';
  }

}
