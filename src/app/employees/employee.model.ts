/**
 * Created by Amin on 04/10/2016.
 */
import * as moment from 'moment';

export class Employee{
    public eid:number;
    public firstname:string;
    public surname:string;
    public rate:string;
    public isManager:boolean;
    public contractDate:Date;
    public contractEnd:Date;

    isEqual(other:Employee){
        return  this.sameName(other) &&
                Math.round(parseFloat(this.rate)*100) === Math.round(parseFloat(other.rate)*100) &&
                this.contractDate === other.contractDate &&
                this.contractEnd === other.contractEnd;
    }

    sameName(other:Employee){
        return this.firstname.toLowerCase()===other.firstname.toLowerCase() &&
                this.surname.toLowerCase() ===other.surname.toLowerCase()
    }

    toString(){
        return this.surname + ', ' + this.firstname;
    }

    toObject(){
        var obj:any;
        obj = {
            firstname:  this.firstname,
            surname:    this.surname,
            rate:       this.rate,
            role:       this.isManager?'Manager':'Employee',
            contract_date:moment(this.contractDate).format(),
        };

        if(this.isExpired())
            obj.contract_end = moment(this.contractEnd).format();

        return obj;
    }

    isExpired(){
        return this.contractEnd.getFullYear()!==1970;
    }

    constructor(input:any){
        var today = new Date();
        var check = x=>x!==undefined?x:'';
        this.eid       = input.eid!==undefined?input.eid:NaN;
        this.firstname = check(input.firstname);
        this.surname   = check(input.surname);
        this.rate      = input.rate!==undefined?input.rate.substr(1):'';
        this.isManager = input.role!==undefined?(input.role==='Manager'?true:false):false;
        this.contractDate= input.contract_date!==undefined?moment(input.contract_date).toDate():today;
        this.contractEnd = input.contract_end ? moment(input.contract_end).toDate(): moment('1970-01-01').toDate();
    }
}