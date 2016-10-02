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

@NgModule({
    declarations:   [AppComponent, LoginComponent, NavbarComponent, LeftbarComponent, RightbarComponent, FooterComponent, MainComponent, HomeComponent, BranchesComponent, UsersComponent, MessageFadeOutComponent, ItemsComponent],
    imports:        [
        BrowserModule,
        // Router
        AppRoutes,
        // Forms
        FormsModule,
        // Material Design
        HttpModule
    ],
    providers:      [LoginService,LoggedInGuard,RestService],
    bootstrap:      [AppComponent]
})
export class AppModule{}