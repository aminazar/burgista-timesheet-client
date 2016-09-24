/**
 * Created by Amin on 15/09/2016.
 */
import {NgModule} from "@angular/core";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {HttpModule} from "@angular/http";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";

@NgModule({
    declarations:   [AppComponent, LoginComponent],
    imports:        [
        BrowserModule,
        // Router
//        RouterModule.forRoot(config),
        // Forms
        FormsModule,
        // Material Design
        HttpModule
    ],
    bootstrap:      [AppComponent]
})
export class AppModule{};