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
    public updateEnabled={};
    public deleteEnabled={};
    public updateCount={};
    public addEnabled=false;
    public message ="";
    public errMessage = "";

    private tableName='employees';
    private apiName='employee';

    constructor(private restService :RestService) {
    }

    remove(id){
        console.log('remove',id);
        var updateState= this.updateEnabled[id];
        this.updateEnabled[id]=undefined;
        this.deleteEnabled[id]=undefined;
        this.restService.delete(this.apiName, id )
            .subscribe((res:any)=>{
                    this.showMessage( 'deleted successfully '+ res.json() + ' row(s)');
                    var ind = this.items.findIndex((el)=>el.eid===id);
                    if(ind !== -1){
                        this.items.splice(ind, 1);
                        delete this.updateEnabled[id];
                        delete this.deleteEnabled[id];
                    }
                },
                (err: Response)=> {
                    this.showError(err.text());
                    this.updateEnabled[id] = updateState;
                    this.deleteEnabled[id] = true;
                }
            );
    }

    add(newItem:Employee) {
        var ind = this.items.findIndex((el)=>newItem.sameName(el));
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

                        var newItemC = newItem.toObject();
                        newItemC.rate = '$' + newItem.rate; //to be similar with postgress output
                        newItem = new Employee({});
                        var newItemO = new Employee(newItemC);
                        newItemO.eid = eid;
                        this.updateEnabled[eid]=false;
                        this.deleteEnabled[eid]=true;
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
      if(updatedItem.isExpired())
          this.showError('It is not possible to update expired records - but you can revive them by leaving "End Date" empty');
      else{
        var values = updatedItem.toObject();
        var eid    = updatedItem.eid;
        this.updateEnabled[eid]=undefined;
        this.deleteEnabled[eid]=false;
        this.restService.update(this.apiName, eid, updatedItem.toObject())
          .subscribe(
            (res:any)=>{
              this.showMessage('"' + updatedItem + '" updated.');
              this.updateEnabled[eid] = false;
              this.deleteEnabled[eid] = true;
              this.updateCount[eid]++;
            },
            (err:Response)=>{
              this.updateEnabled[eid]=true;
              this.deleteEnabled[eid]=true;
              this.showError(err.text());
            }
          )

      }
    }

    onUpdatable(id,value){
        if(this.updateEnabled[id]!==undefined)//do not enable update in middle of another delete or update
            this.updateEnabled[id]=value;
    }

    showError(err){
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
        var stream = this.restService.get(this.tableName);
        stream
            .subscribe(
                (res:any)=> {
                    for(var i in res){
                        var employee = new Employee(res[i]);
                        this.items.push( employee );

                      var eid = res[i].eid;
                        this.updateCount[eid]=0;
                        this.updateEnabled[eid]=false;
                        this.deleteEnabled[eid]=true;
                    }

                },(err:any)=>console.log('Failed to get items',err)
            );
    }


}
