"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = void 0;
class Restaurant {
    constructor(t) {
        var _a;
        this.id = (_a = t.id) !== null && _a !== void 0 ? _a : Date.now();
        this.name = t.name;
        this.adress = t.adress;
        this.phone = t.phone;
        this.nip = t.nip;
        this.email = t.email;
        this.www = t.www;
    }
}
exports.Restaurant = Restaurant;
