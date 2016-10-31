import {Component, OnInit, Input} from '@angular/core';
import {Response} from "@angular/http";
import {RestService} from "../rest.service";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  public newItem = "";
  public items = [];
  public message = "";
  public errMessage = "";
  public beingEdited = {};
  private copy = {};
  private active = {};
  private pending = {};

  @Input('table') tableName:String;
  @Input('api') apiName:String;
  @Input('column') valueColumn:string;
  @Input('id') idColumn:string;
  @Input('placeholder') placeholder:string;

  public btnClass:string;
  public btnLabel:string;
  public btnEnabled:boolean;

  constructor(private restService:RestService) {
    this.enableButton()
  }

  enableButton() {
    this.btnClass = '';
    this.btnLabel = 'Add';
    this.btnEnabled = true;
  }

  disableButton() {
    this.btnClass = 'pressed';
    this.btnLabel = 'Adding...';
    this.btnEnabled = false;
  }

  resetPwd(id) {
    if (!this.active[id] && !this.pending[id]) {
      this.restService.insert('reset/' + id, {email: this.items.find(el=>el[this.idColumn] === id)[this.valueColumn]})
        .subscribe(
          (res:any)=> {
            this.showMessage('Sent a new invitation to this user.');
            this.pending[id] = true;
            this.active[id] = false;
          },
          (err:Response)=> {
            this.showError('Could not sent a new invitation to this user: ' + err.text());
          }
        )
    }
  }

  remove(id) {
    console.log('remove', id);
    this.restService.delete(this.apiName, id)
      .subscribe((res:any)=> {
          var ind = this.items.findIndex((el)=>el[this.idColumn] === id);

          if (res.json() > 0) {
            this.showMessage('deleted successfully ' + res.json() + ' row(s)');
            this.items.splice(ind, 1);
            delete this.beingEdited[id];
            delete this.copy[id];
            delete this.active[id];
            delete this.pending[id];
          }
          else if (res.json() === -1) {
            this.showMessage('There are references to this user in worktime records as modifier - so it cannot be deleted but the account is deactivated and the user will not be able to login anymore.');
            this.active[id] = false;
            this.pending[id] = false;
          }
        },
        (err:Response)=> this.showError(err.text())
      );
  }

  add() {
    var ind = this.items.findIndex((el)=>
    this.newItem.toLowerCase() === el[this.valueColumn].toLowerCase());
    if (ind !== -1) {
      this.showError('"' + this.newItem + '" already exists.')
    }
    else {
      this.disableButton();
      var newRow = {};
      newRow[this.valueColumn] = this.newItem;

      this.restService.insert(this.apiName, newRow)
        .subscribe((res:any)=> {
            this.enableButton();
            var newRow = {};
            var id = res.json();

            switch (this.apiName) {
              case 'user':
                this.showMessage('An email has been sent to "' + this.newItem + '" asking them to set a password.');
                this.active[id] = false;
                this.pending[id] = true;
                break;
              case 'branch':
                this.showMessage('Congratulations! "' + this.newItem + '" is added to the branches.');
                this.active[id] = true;
                break;
              default:
                this.showMessage('Row "' + this.newItem + '" added.');
            }
            ;

            newRow[this.idColumn] = id;
            newRow[this.valueColumn] = this.newItem;
            this.beingEdited[id] = false;
            this.copy[id] = this.newItem;
            this.items.push(newRow);
          },
          (err:Response)=> {
            this.enableButton();
            this.showError(err.text());
          }
        );
    }
  }

  update(id, keyCode) {
    if (keyCode === 13) {
      var values = {};
      values = this.items.find(el=>el[this.idColumn] === id);
      this.restService.update(this.apiName, id, values)
        .subscribe(
          ()=> {
            this.beingEdited[id] = false;
            this.copy[id] = values[this.valueColumn];
          },
          (err:any)=> {
            console.log('Could not update:', err);
            this.beingEdited[id] = false;
            this.items.find(el=>el[this.idColumn] === id)[this.valueColumn] = this.copy[id];
          }
        );
    }
    else if (this.apiName === 'user') {
      this.beingEdited[id] = false;
      this.items.find(el=>el[this.idColumn] === id)[this.valueColumn] = this.copy[id];
    }
  }

  letUpdate(id) {
    this.beingEdited[id] = true;
  }

  showError(err) {
    //To create a change in message to invoke fade out effect
    if (this.errMessage === err)
      this.errMessage += ' ';
    else
      this.errMessage = err;
  }

  showMessage(msg) {
    //To create a change in message to invoke fade out effect
    if (this.message === msg)
      this.message += ' ';
    else
      this.message = msg
  }

  ngOnInit() {
    this.restService.get(this.tableName)
      .subscribe(
        (res:any)=> {
          this.items = res;

          res.forEach((item) => {
            var id = item[this.idColumn];
            this.beingEdited[id] = false;
            this.copy[id] = item[this.valueColumn];
            this.active[id] = item.active;
            this.pending[id] = item.pending > 0;
          });
        },
        (err:any)=>console.log('Failed to get items', err)
      );
  }

}