import { Component, OnInit } from '@angular/core';
import {RestService} from "../rest.service";
import * as moment from 'moment';
let fileSaver = require('file-saver/FileSaver.min.js');
import { ViewContainerRef } from '@angular/core';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  startDate   = moment().subtract(1,'months').toDate();
  endDate     = moment().toDate();
  table:any;
  fTable:any;
  title='';
  public paid = {};
  public calc = {};

  private allBranch = {bid:'ALL',name:'All'};
  private filteredName = '';
  private isFiltered = false;
  public curBranch = this.allBranch.bid;
  public branches = [this.allBranch];
  data = "";

  constructor(private restService:RestService, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
  }

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
      this.title = this.branches.find((el)=>el.bid===this.curBranch).name + ' - From ' + moment(this.startDate).format('DD MMM YY') + ' To ' + moment(this.endDate).format('DD MMM YY');
      this.restService.getWithParams('report/'+this.curBranch+'/ALL', {start: moment(this.startDate).format('YYYY-MM-DD'), end: moment(this.endDate).format('YYYY-MM-DD')})
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

  filter(eid,filteredName){
    this.isFiltered = true;
    this.filteredName = filteredName;
    this.restService.getWithParams('report/'+this.curBranch+'/'+eid, {start: moment(this.startDate).format('YYYY-MM-DD'), end: moment(this.endDate).format('YYYY-MM-DD')})
      .subscribe(
        (data)=>{
          this.fTable = data;
        },
        (err)=>console.log(err));
  }

  unfilter(){
    this.isFiltered = false;
  }

  convertToCSV() {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = [];
  let paid = this.paid;
  let calc = this.calc;
  if(this.isFiltered) {
    this.fTable.forEach((currentVal, index)=> {
      data.push({
        "#": index + 1,
        "Branch": this.curBranch==='ALL'?currentVal.branch:this.curBranch,
        "Hours Worked": currentVal.hours,
        "Minutes Worked": currentVal.mins,
        "Minutes Took Break": currentVal.breaktime,
        "No Break Was Active": currentVal.nobreak,
      })
    })
  }
  else {
    this.table.forEach(function (currentVal, index) {
      data.push({
        "#": index + 1,
        "ID": currentVal.eid,
        "First Name": currentVal.firstname,
        "Surname": currentVal.surname,
        "Hourly Rate": currentVal.rate.substr(1),
        "Hours Worked": currentVal.hours,
        "Minutes Worked": currentVal.mins,
        "Minutes Took Break": currentVal.breaks,
        "Wage Sum": '£' + calc[currentVal.eid].toFixed(2),
        "Wage Paid": '£' + parseFloat(paid[currentVal.eid]).toFixed(2),
        "Wage Remainder": '£' + (calc[currentVal.eid] - paid[currentVal.eid]).toFixed(2)
      });
    });
  }
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
  if(this.isFiltered)
    filename = this.filteredName + ' - ' + filename;
  fileSaver.saveAs(blob,filename);
}
  ngOnInit() {
    this.restService.get('branches')
      .subscribe((res:any)=>{this.branches=[this.allBranch].concat(res)},(err:any)=>console.log('Failed to get branches',err));
    this.check();
  }

  changeBranch(i){
    this.curBranch=this.branches[i.index].bid;
    this.check();
  }
}
