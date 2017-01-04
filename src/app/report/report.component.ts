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
  private breaksSumHours;
  private breaksSumMinutes;
  private payingTimeSumHours;
  private payingTimeSumMinutes;
  private holdiaySumHours;
  private holidaySumMinutes;
  private fPayingTimeSumHours;
  private fPayingTimeSumMinutes;
  private fMinsSum;
  private fHoursSum;
  private fBreaktimeSumHours;
  private fBreaktimeSumMinutes;
  private sumSum:any;
  private wageSum;
  private paidSum:any=0;
  private remainderSum:any=0;

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
            this.breaksSumHours = 0;
            this.breaksSumMinutes = 0;
            this.payingTimeSumHours = 0;
            this.payingTimeSumMinutes = 0;
            this.holdiaySumHours = 0;
            this.holidaySumMinutes = 0;
            this.sumSum = 0;
            let breaksSum = 0;
            for(var i in this.table) {
              this.paid[this.table[i].eid] = 0;
              this.table[i].breaks_hours = Math.floor(this.table[i].breaks / 60);
              this.table[i].breaks_mins = Math.round(this.table[i].breaks % 60);

              if(this.table[i].mins<this.table[i].breaks_mins){
                this.table[i].paying_time_mins  = 60 + this.table[i].mins - this.table[i].breaks_mins;
                this.table[i].paying_time_hours = this.table[i].hours - this.table[i].breaks_hours - 1;
              }
              else{
                this.table[i].paying_time_hours = this.table[i].hours - this.table[i].breaks_hours;
                this.table[i].paying_time_mins  = this.table[i].mins - this.table[i].breaks_mins;
              }
              let holiday = .12 * (this.table[i].paying_time_hours * 60 + this.table[i].paying_time_mins);
              this.table[i].holiday_hours = Math.floor(holiday / 60);
              this.table[i].holiday_mins  = Math.round(holiday % 60);
              this.calc[this.table[i].eid] = Math.round( 100 * parseFloat(this.table[i].rate.substr(1)) * (this.table[i].hours + (this.table[i].mins-parseInt(this.table[i].breaks)) / 60 ) ) / 100;
              this.minsSum += this.table[i].mins;
              if(this.minsSum >= 60){
                this.hoursSum ++;
                this.minsSum -= 60;
              }
              this.hoursSum += this.table[i].hours;
              breaksSum += parseInt(this.table[i].breaks);
              this.holdiaySumHours += this.table[i].holiday_hours;
              this.holidaySumMinutes += this.table[i].holiday_mins;
              this.payingTimeSumHours += this.table[i].paying_time_hours;
              this.payingTimeSumMinutes += this.table[i].paying_time_mins;
              this.sumSum += this.calc[this.table[i].eid];
              ['mins','breaks_mins','paying_time_mins','holiday_mins'].forEach(t =>{if(this.table[i][t]<10)this.table[i][t]='0'+this.table[i][t]});
            }
            this.breaksSumHours = Math.floor(breaksSum/60);
            this.breaksSumMinutes = Math.round(breaksSum % 60);
            if(this.holidaySumMinutes>=60){
              this.holdiaySumHours    += Math.floor(this.holidaySumMinutes/60);
              this.holidaySumMinutes  = Math.round(this.holidaySumMinutes%60);
            }
            if(this.payingTimeSumMinutes>=60){
              this.payingTimeSumHours += Math.floor(this.payingTimeSumMinutes/60);
              this.payingTimeSumMinutes  = Math.round(this.payingTimeSumMinutes%60)
            }
            this.recalcPaid();
            ['minsSum','breaksSumMinutes','holidaySumMinutes','payingTimeSumMinutes'].forEach(t =>{if(this[t]<10)this[t]='0'+this[t]});
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
          this.fBreaktimeSumHours = 0;
          this.fBreaktimeSumMinutes = 0;
          this.wageSum=0;
          let breaktimeSum = 0;
          this.fPayingTimeSumHours = 0;
          this.fPayingTimeSumMinutes = 0;
          for(var i in this.fTable){
            let row = this.table.find(r=>r.eid===this.filteredEid);
            this.fTable[i].wage = Math.round( 100 * parseFloat(row.rate.substr(1)) * (this.fTable[i].hours + (this.fTable[i].mins-parseInt(this.fTable[i].breaktime)) / 60 ) ) / 100;
            this.fTable[i].start_time = this.fTable[i].start_time.substr(0,5);
            this.fTable[i].end_time = this.fTable[i].end_time.substr(0,5);
            this.fTable[i].rate = this.fTable[i].rate.substr(1);
            this.fMinsSum += this.fTable[i].mins;
            if(this.fMinsSum >= 60){
              this.fHoursSum ++;
              this.fMinsSum -= 60;
            }
            this.fHoursSum += this.fTable[i].hours;
            breaktimeSum += this.fTable[i].breaktime;
            this.wageSum += this.fTable[i].wage;
            this.fTable[i].paying_time_hours = this.fTable[i].hours;
            if(this.fTable[i].mins<this.fTable[i].breaktime){
              this.fTable[i].paying_time_mins  = 60 + this.fTable[i].mins - this.fTable[i].breaktime;
              this.fTable[i].paying_time_hours --;
            }
            else{
              this.fTable[i].paying_time_mins  = this.fTable[i].mins - this.fTable[i].breaktime;
            }
            this.fPayingTimeSumHours    += this.fTable[i].paying_time_hours;
            this.fPayingTimeSumMinutes  += this.fTable[i].paying_time_mins;
            ['mins','paying_time_mins'].forEach(t =>{if(this.fTable[i][t]<10)this.fTable[i][t]='0'+this.fTable[i][t]});
          }
          this.fBreaktimeSumHours   = Math.floor(breaktimeSum/60);
          this.fBreaktimeSumMinutes = Math.round(breaktimeSum%60);
          if(this.fPayingTimeSumMinutes>=60){
            this.fPayingTimeSumHours    +=  Math.floor(this.fPayingTimeSumMinutes / 60);
            this.fPayingTimeSumMinutes  =   Math.round(this.fPayingTimeSumMinutes % 60);
          }
          ['fMinsSum','fBreaktimeSumMinutes','fPayingTimeSumMinutes'].forEach(t =>{if(this[t]<10)this[t]='0'+this[t]});
          this.wageSum = this.wageSum.toFixed(2);
        },
        (err)=>console.log(err));
  }

  unfilter(){
    this.isFiltered = false;
  }
  recalcPaid(){
    this.paidSum      = this.table.map(r=>parseFloat(this.paid[r.eid]?this.paid[r.eid]:0)).reduce((r1,r2)=>r1+r2,0).toFixed(2);
    this.remainderSum = (this.sumSum - this.paidSum).toFixed(2);
    if(typeof this.sumSum==='number')
      this.sumSum     = this.sumSum.toFixed(2);
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
        "Rate": '£' + currentVal.rate,
        "Worked": currentVal.hours + ':' + currentVal.mins,
        "Break": currentVal.breaktime,
        "Paying Time": currentVal.paying_time_hours + ':' + currentVal.paying_time_mins,
        "Wage":'£' +currentVal.wage.toFixed(2),
      })
    });
    data.push({
      '#':'Sum',
      'Date':'',
      'Branch':'',
      'Start Time':'',
      'End Time':'',
      'Rate':'',
      'Worked': this.fHoursSum + ':' + this.fMinsSum,
      'Break': this.fBreaktimeSumHours + ':' + this.fBreaktimeSumMinutes,
      'Paying Time': this.fPayingTimeSumHours + ':' + this.fPayingTimeSumMinutes,
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
        "Worked": currentVal.hours + ":" + currentVal.mins,
        "Breaks": currentVal.breaks_hours + ':' + currentVal.breaks_mins,
        "Paying Time": currentVal.paying_time_hours + ':' + currentVal.paying_time_mins,
        "Holiday Entitlement": currentVal.holiday_hours + ':' + currentVal.holiday_mins,
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
      "Worked": this.hoursSum + ":" + this.minsSum,
      "Breaks": this.breaksSumHours + ':' + this.breaksSumMinutes,
      "Paying Time": this.payingTimeSumHours + ':' + this.payingTimeSumMinutes,
      "Holiday Entitlement": this.holdiaySumHours + ':' + this.holidaySumMinutes,
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