import { Component, OnInit } from '@angular/core';
import {RestService} from "../rest.service";
import * as moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  startDate:Date;
  endDate:Date;
  table:any;
  title=''
  paid = {};
  calc = {};

  constructor(private restService:RestService) { }

  onEndSelect(d){
    this.endDate = d;
    this.check()
  }
  onStartSelect(d){
    this.startDate=d;
    this.check();
  }
  check(){
    if(this.startDate && this.endDate && this.startDate <= this.endDate) {
      this.title = 'From ' + moment(this.startDate).format('DD MMM YY') + ' To ' + moment(this.endDate).format('DD MMM YY');
      this.restService.getWithParams('report/ALL/ALL', {start: this.startDate, end: this.endDate})
        .subscribe(
          (data)=>{
            this.table = data;
            for(var i in this.table) {
              this.paid[this.table[i].eid] = 0;
              this.calc[this.table[i].eid] = Math.round( 100 * parseFloat(this.table[i].rate.substr(1)) * (this.table[i].hours + (this.table[i].minutes-this.table[i].breaks) / 60 ) ) / 100;
            }
          },
          (err)=>console.log(err))
    }
  }


  ngOnInit() {
  }

}
