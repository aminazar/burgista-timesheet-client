/**
 * Created by Amin on 04/10/2016.
 */
import * as moment from 'moment';
import { INF_DATE } from '../constants';

export class Employee{
    public eid:number;
    public firstname:string;
    public surname:string;
    public email:string;
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
                this.username   === other.username &&
                this.email      === other.email
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
            email:          this.email,
            rate:           this.rate,
            role:           this.isManager?'Manager':'Employee',
            contract_date:  moment.utc(this.contractDate).format('YYYY-MM-DD'),
            contract_end:   this.contractEnd !== INF_DATE ? moment(this.contractEnd).format('YYYY-MM-DD') : 'infinity',
        };
        if(this.isManager){
            obj.username= this.username;
            obj.password= this.password;
        }

        return obj;
    }

    isExpired(){
        let d = new Date();
        return this.contractEnd !== INF_DATE && this.contractEnd < d;
    }

    constructor(input:any){
        var today = new Date();
        var check = x=>x!==undefined?x:'';
        this.eid       = input.eid!==undefined?input.eid:NaN;
        this.firstname = check(input.firstname);
        this.surname   = check(input.surname);
        this.email     = check(input.email);
        this.rate      = input.rate!==undefined?input.rate.substr(1):'';
        this.isManager = input.role!==undefined?(input.role==='Manager'?true:false):false;
        this.contractDate= input.contract_date!==undefined?moment(input.contract_date).toDate():today;
        this.contractEnd = (input.contract_end && input.contract_end !=='infinity') ? moment(input.contract_end).toDate(): INF_DATE;
        this.username    = (input.username)?input.username:'';
    }
}