import { Component } from '@angular/core';
import {RestService} from "../rest.service";

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent {
  public newItem = "";

  public branches = [];

  constructor(private restService :RestService) {
    restService.get('branches')
        .subscribe((res:any)=>this.branches=res,(err:any)=>console.log('Failed to get branches',err));
  }

  remove(bid){
    console.log('remove',bid);
    this.restService.delete('branch', bid )
        .subscribe((res:any)=>{
          console.log('deleted successfully '+ res.json() + ' row(s)');
          if(res.json() !== 0) {
            var ind = this.branches.findIndex((el)=>el.bid === bid);
            this.branches.splice(ind, 1);
          }
        }, (err:any)=>console.log('deleting failed')
        );
  }

  add(){
    console.log('add',this.newItem);
    this.restService.insert('branch',{name:this.newItem})
        .subscribe((res:any)=>{
          console.log('added successfully',res.bid);
          this.branches.push({bid:res.bid,name:this.newItem});
        },(err:any)=>console.log('adding failed,',err));
  }
}
