/**
 * Created by Amin on 15/09/2016.
 */
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { NavbarComponent } from './navbar/navbar.component';
import { LeftbarComponent } from './leftbar/leftbar.component';
import { RightbarComponent } from './rightbar/rightbar.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import {AppRoutes} from "./app.routes";
import { HomeComponent } from './home/home.component';
import { BranchesComponent } from './branches/branches.component';
import {LoginService} from "./login/login.service";
import {LoggedInGuard} from "./login/logged-in.guard";
import {RestService} from "./rest.service";
import { UsersComponent } from './users/users.component';
import { MessageFadeOutComponent } from './message-fade-out/message-fade-out.component';
import { ItemsComponent } from './items/items.component';
import { EmployeesComponent } from './employees/employees.component';
import { TimesComponent } from './times/times.component';
import { ReportComponent } from './report/report.component';
import { EmployeeFormComponent } from './employees/employee-form.component';
import { MaterialModule } from "@angular/material";
import { DatepickerComponent } from './angular2-material-datepicker/datepicker.component';
import { BranchTimesheetComponent } from './times/branch-timesheet.component';
import { WorktimeComponent } from './times/worktime.component';
import { TimerComponent } from './times/timer.component';
import { IntervalInputComponent } from './times/interval-input.component';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

@NgModule({
    declarations:   [AppComponent, LoginComponent, NavbarComponent, LeftbarComponent, RightbarComponent, FooterComponent, MainComponent, HomeComponent, BranchesComponent, UsersComponent, MessageFadeOutComponent, ItemsComponent, EmployeesComponent, TimesComponent, ReportComponent, EmployeeFormComponent, EmployeeFormComponent, DatepickerComponent, BranchTimesheetComponent, WorktimeComponent, TimerComponent, IntervalInputComponent],
    imports:        [
        BrowserModule,
        AppRoutes,
        // Forms
        FormsModule,
        MaterialModule.forRoot(),
        HttpModule,
        Ng2AutoCompleteModule,
    ],
    providers:      [LoginService,RestService,LoggedInGuard],
    bootstrap:      [AppComponent]
})
export class AppModule{}