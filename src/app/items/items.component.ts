import {Component, OnInit, Input } from '@angular/core';
import {Response} from "@angular/http";
import {RestService} from "../rest.service";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit{

  public newItem = "";
  public items = [];
  public message ="";
  public errMessage = "";

  @Input('table') tableName: String;
  @Input('api') apiName: String;
  @Input('column') valueColumn: string;
  @Input('id') idColumn: string;
  @Input('placeholder') placeholder:string;

  public btnClass: string;
  public btnLabel:  string;
  public btnEnabled: boolean;

  constructor(private restService :RestService) {
    this.enableButton()
  }
  enableButton(){
    this.btnClass='';
    this.btnLabel='Add';
    this.btnEnabled= true;
  }
  disableButton(){
    this.btnClass='pressed';
    this.btnLabel='Adding...';
    this.btnEnabled= false;
  }
  remove(id){
    console.log('remove',id);
    this.restService.delete(this.apiName, id )
        .subscribe((res:any)=>{
              this.showMessage( 'deleted successfully '+ res.json() + ' row(s)');
              if(res.json() !== 0) {
                var ind = this.items.findIndex((el)=>el[this.idColumn]=== id);
                this.items.splice(ind, 1);

              }
            },
            (err: Response)=> this.showError(err.text())
        );
  }

  add() {
    var ind = this.items.findIndex((el)=>
      this.newItem.toLowerCase()===el[this.valueColumn].toLowerCase());
    if( ind !== -1 ){
      this.showError('"'+ this.newItem + '" already exists.')
    }
    else{
      this.disableButton();
      var newRow = {};
      newRow[this.valueColumn]=this.newItem;

      this.restService.insert(this.apiName, newRow)
          .subscribe((res:any)=> {
                this.enableButton();
                switch( this.apiName ) {
                  case 'user':
                    this.showMessage('An email has been sent to "' + this.newItem + '" asking them to set a password.');
                    break;
                  case 'branch':
                    this.showMessage('Congratulations! "' + this.newItem + '" is added to the branches.');
                    break;
                  default:
                    this.showMessage('Row "' + this.newItem + '" added.');
                };

                var newRow = {};
                newRow[this.idColumn]    = res.json();
                newRow[this.valueColumn] = this.newItem;
                this.items.push(newRow);
              },
              (err:Response)=>{this.enableButton(); this.showError(err.text());}
          );
    }
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
        .subscribe((res:any)=>this.items=res,(err:any)=>console.log('Failed to get items',err));
  }

}