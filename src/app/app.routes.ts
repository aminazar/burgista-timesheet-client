import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {BranchesComponent} from "./branches/branches.component";
import {LoggedInGuard} from "./login/logged-in.guard";
import {UsersComponent} from "./users/users.component";
import {EmployeesComponent} from "./employees/employees.component";

const APP_ROUTES=[
    { path: '',         component: HomeComponent,       pathMatch: 'full' },
    { path: 'login',    component: LoginComponent },
    { path: 'branches', component: BranchesComponent,   canActivate: [LoggedInGuard] },
    { path: 'users',    component: UsersComponent,      canActivate: [LoggedInGuard] },
    { path: 'employees',component: EmployeesComponent,  canActivate: [LoggedInGuard] },
];

export const AppRoutes = RouterModule.forRoot( APP_ROUTES );