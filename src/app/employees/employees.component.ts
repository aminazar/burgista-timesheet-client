import { Component, OnInit } from '@angular/core';
import {RestService} from "../rest.service";
import {Response} from "@angular/http";
import {Employee} from "./employee.model";

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  public items:Array<Employee> = new Array<Employee>();
  public indices={};
  public updateEnabled = {};
  public addEnabled=true;
  public message ="";
  public errMessage = "";

  private tableName='employees';
  private apiName='employee';


  constructor(private restService :RestService) {
  }

  remove(id){
    console.log('remove',id);
    this.updateEnabled[id]=false;
    this.restService.delete(this.apiName, id )
        .subscribe((res:any)=>{
            this.updateEnabled[id]=true;
            this.showMessage( 'deleted successfully '+ res.json() + ' row(s)');
              if(res.json() !== 0) {
                var ind = this.indices[id];
                this.items.splice(ind, 1);
                delete this.indices[id];
                delete this.updateEnabled[id];
              }
            },
            (err: Response)=> this.showError(err.text())
        );
  }

  add(newItem:Employee) {
    var ind = this.items.findIndex((el)=>
    newItem.isEqual(el));
    if( ind !== -1 ){
      this.showError('"'+ newItem + '" already exists.')
    }
    else{
      this.addEnabled=false;
      this.restService.insert(this.apiName, newItem.toObject())
          .subscribe((res:any)=> {
                this.addEnabled=true;
                this.showMessage('Row "' + newItem + '" added.');
                var eid = res.json();
                newItem.rate = '$' + newItem.rate; //to be similar with postgress output
                var newItemO = new Employee(newItem.toObject());
                newItemO.eid = eid;
                this.updateEnabled[eid]=true;
                this.indices[eid]=this.items.length;
                this.items.push(newItemO);
              },
              (err:Response)=>{
                  this.showError(err.text());
                  this.addEnabled=true;
              }
          );
    }
  }

  update(updatedItem:Employee){
      var values = updatedItem.toObject();
      var eid    = updatedItem.eid;
      this.updateEnabled[eid]=false;
      this.restService.update(this.apiName, eid, updatedItem.toObject())
          .subscribe(
              (res:any)=>{
                  this.updateEnabled[eid]=true;
                  this.items[this.indices[eid]]=updatedItem;
              },
              (err:Response)=>{
                  this.updateEnabled[eid]=true;
                  this.items.splice(this.indices[eid],1,this.items[this.indices[eid]]);//deleting and inserting the same thing, to revert update effects in form
                  this.showError(err.text());
              }
          )
  }

  showError(err) {
    //To create a change in message to invoke fade out effect
    if(this.errMessage === err)
      this.errMessage += ' ';
    else
      this.errMessage = err;
  }

  showMessage(msg){
    //To create a change in message to invoke fade out effect
    if(this.message === msg)
      this.message+=' ';
    else
      this.message = msg
  }

  ngOnInit(){
    this.restService.get(this.tableName)
        .subscribe(
            (res:any)=> {
              for(var i in res){
                  var employee = new Employee(res[i]);
                  this.items.push( employee );
                  this.updateEnabled[res[i].eid]=true;
                  this.indices[res[i].toString()]=i;
              }

            },(err:any)=>console.log('Failed to get items',err)
            );
  }


}
