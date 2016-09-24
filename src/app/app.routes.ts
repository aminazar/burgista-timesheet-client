import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import {HomeComponent} from "./home/home.component";

const APP_ROUTES=[
    { path: '',         component: HomeComponent },
    { path: 'login',    component: LoginComponent }
];

export const AppRoutes = RouterModule.forRoot( APP_ROUTES );