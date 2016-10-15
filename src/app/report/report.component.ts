import { Component, OnInit } from '@angular/core';
import {RestService} from "../rest.service";
import * as moment from 'moment';
let fileSaver = require('file-saver/FileSaver.min.js');

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  startDate:Date;
  endDate:Date;
  table:any;
  title='';
  public paid = {};
  public calc = {};
  data = "";

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
      this.restService.getWithParams('report/ALL/ALL', {start: moment(this.startDate).format('YYYY-MM-DDTHH:mm:ss')+'Z', end: moment(this.endDate).format('YYYY-MM-DDTHH:mm:ss')+'Z'})
        .subscribe(
          (data)=>{
            this.table = data;
            for(var i in this.table) {
              this.paid[this.table[i].eid] = 0;
              this.calc[this.table[i].eid] = Math.round( 100 * parseFloat(this.table[i].rate.substr(1)) * (this.table[i].hours + (this.table[i].mins-parseInt(this.table[i].breaks)) / 60 ) ) / 100;
            }
          },
          (err)=>console.log(err));
    }
  }

  convertToCSV() {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = [];
  let paid = this.paid;
  let calc = this.calc;
  this.table.forEach(function(currentVal, index){
    data.push({ "#":                  index + 1,
                "ID":                 currentVal.eid,
                "First Name":         currentVal.firstname,
                "Surname":            currentVal.surname,
                "Hourly Rate":        currentVal.rate.substr(1),
                "Hours Worked":       currentVal.hours,
                "Minutes Worked":     currentVal.mins,
                "Minutes Took Break": currentVal.breaks,
                "Wage Sum":           '£'+calc[currentVal.eid].toFixed(2),
                "Wage Paid":          '£'+parseFloat(paid[currentVal.eid]).toFixed(2),
                "Wage Remainder":     '£'+(calc[currentVal.eid]-paid[currentVal.eid]).toFixed(2)
              });
  });

  columnDelimiter =  ',';
  lineDelimiter =  '\n';

  keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function(item) {
    ctr = 0;
    keys.forEach(function(key) {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

  downloadCSV(args) {
  var filename;

  var csv =  this.convertToCSV();
  if (csv == null) return;
  var blob = new Blob([csv], {type: 'text/csv'});
  filename = this.title + '.csv';
  fileSaver.saveAs(blob,filename);
}
  ngOnInit() {
  }

}
