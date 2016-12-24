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
  private filteredEid = NaN;
  private hoursSum;
  private minsSum;
  private fMinsSum;
  private fHoursSum;
  private breaksSum;
  private fBreaktimeSum;
  private sumSum;
  private wageSum;
  private paidSum=0;
  private remainderSum=0;

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
            this.hoursSum = 0;
            this.minsSum = 0;
            this.breaksSum = 0;
            this.sumSum = 0;
            for(var i in this.table) {
              this.paid[this.table[i].eid] = 0;
              this.calc[this.table[i].eid] = Math.round( 100 * parseFloat(this.table[i].rate.substr(1)) * (this.table[i].hours + (this.table[i].mins-parseInt(this.table[i].breaks)) / 60 ) ) / 100;
              this.minsSum += this.table[i].mins;
              if(this.minsSum >= 60){
                this.hoursSum ++;
                this.minsSum -= 60;
              }
              this.hoursSum += this.table[i].hours;
              this.breaksSum += parseInt(this.table[i].breaks);
              this.sumSum += this.calc[this.table[i].eid];
            }
            this.sumSum = this.sumSum.toFixed(2);
            this.recalcPaid();
          },
          (err)=>console.log(err));
      if(this.isFiltered)
        this.getFilteredTable();
    }
  }

  filter(eid, filteredName){
    this.isFiltered = true;
    this.filteredName = filteredName;
    this.filteredEid = eid;
    this.getFilteredTable();
  }

  private getFilteredTable() {
    this.restService.getWithParams('report/' + this.curBranch + '/' + this.filteredEid, {
      start: moment(this.startDate).format('YYYY-MM-DD'),
      end: moment(this.endDate).format('YYYY-MM-DD')
    })
      .subscribe(
        (data)=> {
          this.fTable = data;
          this.fMinsSum = 0;
          this.fHoursSum = 0;
          this.fBreaktimeSum = 0;
          this.wageSum=0;
          for(var i in this.fTable){
            let row = this.table.find(r=>r.eid===this.filteredEid);
            this.fTable[i].wage = Math.round( 100 * parseFloat(row.rate.substr(1)) * (this.fTable[i].hours + (this.fTable[i].mins-parseInt(this.fTable[i].breaktime)) / 60 ) ) / 100;
            this.fTable[i].start_time = this.fTable[i].start_time.substr(0,5);
            this.fTable[i].end_time = this.fTable[i].end_time.substr(0,5);
            this.fMinsSum += this.fTable[i].mins;
            if(this.fMinsSum >= 60){
              this.fHoursSum ++;
              this.fMinsSum -= 60;
            }
            this.fHoursSum += this.fTable[i].hours;
            this.fBreaktimeSum += this.fTable[i].breaktime;
            this.wageSum += this.fTable[i].wage;
          }
          this.wageSum = this.wageSum.toFixed(2);
        },
        (err)=>console.log(err));
  }

  unfilter(){
    this.isFiltered = false;
  }
  recalcPaid(){
    this.paidSum      = this.table.map(r=>parseFloat(this.paid[r.eid])).reduce((r1,r2)=>r1+r2,0).toFixed(2);
    this.remainderSum = this.sumSum - this.paidSum;
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
        "Date": currentVal.sdate,
        "Branch": this.curBranch==='ALL'?currentVal.branch:'',
        "Start Time": currentVal.start_time,
        "End Time": currentVal.end_time,
        "No Break Was Active": currentVal.nobreak,
        "Hours Worked": currentVal.hours,
        "Minutes Worked": currentVal.mins,
        "Minutes Took Break": currentVal.breaktime,
        "Wage":'£' +currentVal.wage,
      })
    });
    data.push({
      '#':'Sum',
      'Date':'',
      'Branch':'',
      'Start Time':'',
      'End Time':'',
      'No Break Was Active':'',
      'Hours Worked': this.fHoursSum,
      'Minutes Worked': this.fMinsSum,
      'Minutes Took Break': this.fBreaktimeSum,
      'Wage':'£' + this.wageSum,
    })
  }
  else {
    this.table.forEach(function (currentVal, index) {
      data.push({
        "#": index + 1,
        "ID": currentVal.eid,
        "First Name": currentVal.firstname,
        "Surname": currentVal.surname,
        "Hourly Rate": '£' +currentVal.rate.substr(1),
        "Hours Worked": currentVal.hours,
        "Minutes Worked": currentVal.mins,
        "Minutes Took Break": currentVal.breaks,
        "Wage Sum": '£' + calc[currentVal.eid].toFixed(2),
        "Wage Paid": '£' + parseFloat(paid[currentVal.eid]).toFixed(2),
        "Wage Remainder": '£' + (calc[currentVal.eid] - paid[currentVal.eid]).toFixed(2)
      });
    });
    data.push({
      "#": 'Sum',
      "ID": '',
      "First Name": '',
      "Surname": '',
      "Hourly Rate": '',
      "Hours Worked": this.hoursSum,
      "Minutes Worked": this.minsSum,
      "Minutes Took Break": this.breaksSum,
      "Wage Sum": '£' + this.sumSum,
      "Wage Paid": '£' + this.paidSum,
      "Wage Remainder": '£' + this.remainderSum,
    })
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
