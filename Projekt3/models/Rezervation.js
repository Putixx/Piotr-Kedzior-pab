"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rezervation = void 0;
class Rezervation {
    constructor(t) {
        var _a;
        this.id = (_a = t.id) !== null && _a !== void 0 ? _a : Date.now();
        this.table = t.table;
        this.start = t.start;
        this.end = t.end;
        this.client = t.client;
    }
}
exports.Rezervation = Rezervation;
