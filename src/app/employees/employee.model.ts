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
    public username:string;
    public password:string;

    isEqual(other:Employee){
        return  this.sameName(other) &&
                Math.round(parseFloat(this.rate)*100) === Math.round(parseFloat(other.rate)*100) &&
                this.contractDate === other.contractDate &&
                this.contractEnd === other.contractEnd &&
                this.password   === other.password &&
                this.username   === other.username
    }

    sameName(other:Employee){
        return this.firstname.toLowerCase()===other.firstname.toLowerCase() &&
                this.surname.toLowerCase() ===other.surname.toLowerCase()
    }

    toString(){
        return this.firstname + ' ' + this.surname;
    }

    toObject(){
        var obj:any;
        obj = {
            firstname:      this.firstname,
            surname:        this.surname,
            rate:           this.rate,
            role:           this.isManager?'Manager':'Employee',
            contract_date:  moment.utc(this.contractDate).format('YYYY-MM-DD'),
            contract_end:   this.isExpired() ? moment(this.contractEnd).toDate() : 'infinity',
        };
        if(this.isManager){
            obj.username= this.username;
            obj.password= this.password;
        }

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
        this.contractEnd = (input.contract_end && input.contract_end !=='infinity') ? moment(input.contract_end).toDate(): moment('1970-01-01').toDate();
        this.username    = (input.username)?input.username:'';
    }
}