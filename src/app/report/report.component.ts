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
  title='';
  paid = {};
  calc = {};
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

  convertArrayOfObjectsToCSV(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';

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
  var data, filename, link;

  var csv =  this.convertArrayOfObjectsToCSV({data: this.table});
  if (csv == null) return;

  filename = this.title + '.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  this.data = encodeURI(csv);

}
  ngOnInit() {
  }

}
