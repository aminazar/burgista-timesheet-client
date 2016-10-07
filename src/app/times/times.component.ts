import { Component, OnInit } from '@angular/core';
import {RestService} from "../rest.service";

@Component({
  selector: 'app-times',
  templateUrl: './times.component.html',
  styleUrls: ['./times.component.css']
})
export class TimesComponent implements OnInit {
  private branches: Array<any>;
  private curBranch='';
  public tDate:Date = new Date();

  onDateSelect(d){
   this.tDate=d;
  }

  constructor(private restService :RestService) {
    var today = new Date;
   this.tDate= today;
  }

  ngOnInit() {
    this.restService.get('branches')
      .subscribe((res:any)=>{this.branches=res;this.curBranch=res[0];},(err:any)=>console.log('Failed to get branches',err));
  }

  changeBranch(bid){
    this.curBranch=this.branches.find(el=>el.bid===bid);
  }
}
