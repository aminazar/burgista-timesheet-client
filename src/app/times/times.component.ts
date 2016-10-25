import { Component, OnInit } from '@angular/core';
import {RestService} from "../rest.service";
import * as moment from 'moment';

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

  dateBack(){
    this.tDate = moment(this.tDate).subtract(1,'days').toDate();
  }

  dateForward(){
    this.tDate = moment(this.tDate).add(1,'days').toDate();
  }

  ngOnInit() {
    this.restService.get('branches')
      .subscribe((res:any)=>{this.branches=res;this.curBranch=res[0];},(err:any)=>console.log('Failed to get branches',err));
  }

  changeBranch(bid){
    this.curBranch=this.branches.find(el=>el.bid===bid);
  }
}
