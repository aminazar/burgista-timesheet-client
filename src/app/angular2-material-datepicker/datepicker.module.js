"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var core_1 = require('@angular/core');
var datepicker_component_1 = require('./datepicker.component.ts');
__export(require('./datepicker.component.ts'));
var DatepickerModule = (function () {
    function DatepickerModule() {
    }
    DatepickerModule = __decorate([
        core_1.NgModule({
            declarations: [datepicker_component_1.DatepickerComponent],
            exports: [datepicker_component_1.DatepickerComponent],
            imports: [platform_browser_1.BrowserModule, forms_1.FormsModule]
        }), 
        __metadata('design:paramtypes', [])
    ], DatepickerModule);
    return DatepickerModule;
}());
exports.DatepickerModule = DatepickerModule;
//# sourceMappingURL=datepicker.module.js.map