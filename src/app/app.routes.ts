import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {BranchesComponent} from "./branches/branches.component";
import {LoggedInGuard} from "./login/logged-in.guard";

const APP_ROUTES=[
    { path: '',         component: HomeComponent,       pathMatch: 'full' },
    { path: 'login',    component: LoginComponent },
    { path: 'branches', component: BranchesComponent,   canActivate: [LoggedInGuard] },
];

export const AppRoutes = RouterModule.forRoot( APP_ROUTES );