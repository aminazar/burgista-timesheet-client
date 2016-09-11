import { bootstrap } from '@angular/platform-browser-dynamic';
import {enableProdMode, provide} from '@angular/core';
import { AppComponent, environment } from './app/';
import {disableDeprecatedForms, provideForms} from "@angular/forms";

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent,[
  disableDeprecatedForms(),
  provideForms()
]);
