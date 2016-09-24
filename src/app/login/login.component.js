"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var login_service_1 = require("./login.service");
var LoginComponent = (function () {
    function LoginComponent(loginService) {
        this.loginService = loginService;
        this.user = {
            username: '',
            password: '',
            forget: false
        };
    }
    LoginComponent.prototype.onSubmit = function (loginForm) {
        this.loginService.sendData(this.user)
            .subscribe(function (data) {
            console.log(data);
        });
    };
    LoginComponent.prototype.makeForgetFalse = function () {
        this.user.forget = false;
    };
    LoginComponent.prototype.ngOnInit = function () { };
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'burgista-ts-login',
            templateUrl: 'login.component.html',
            styleUrls: ['login.component.css'],
            providers: [login_service_1.LoginService]
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map