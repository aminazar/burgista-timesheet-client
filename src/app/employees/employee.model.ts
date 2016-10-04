/**
 * Created by Amin on 04/10/2016.
 */
export class Employee{
    public eid:number;
    public firstname:string;
    public surname:string;
    public rate:string;
    public isManager:boolean;

    isEqual(other:Employee){
        return this.firstname.toLowerCase()===other.firstname.toLowerCase() &&
                this.surname.toLowerCase() ===other.surname.toLowerCase();
    }

    toString(){
        return this.surname + ', ' + this.firstname;
    }

    toObject(){
        return {
            firstname:  this.firstname,
            surname:    this.surname,
            rate:       this.rate,
            role:       this.isManager?'Manager':'Employee'
        }
    }

    constructor(input:any){
        var check = x=>x!==undefined?x:'';
        this.eid       = input.eid!==undefined?input.eid:NaN;
        this.firstname = check(input.firstname);
        this.surname   = check(input.surname);
        this.rate      = input.rate!==undefined?input.rate.substr(1):'';
        this.isManager = input.role!==undefined?(input.role==='Manager'?true:false):false;
    }
}