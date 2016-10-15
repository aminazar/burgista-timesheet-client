import { Component } from '@angular/core';
import {MdIconRegistry} from "@angular/material";
import {LoggedInGuard} from "./login/logged-in.guard";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [ LoggedInGuard ],
})
export class AppComponent {
  constructor(mdIconRegistry: MdIconRegistry){
    mdIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }
}
