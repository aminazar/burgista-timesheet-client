import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/';
/*
import { bootstrap } from '@angular/platform-browser-dynamic';
import {enableProdMode, provide} from '@angular/core';
import { AppComponent, environment } from './app/';
import {disableDeprecatedForms, provideForms} from "@angular/forms";
import {HTTP_PROVIDERS} from "@angular/http";

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent,[
  HTTP_PROVIDERS,
  disableDeprecatedForms(),
  provideForms()
]);
*/
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
