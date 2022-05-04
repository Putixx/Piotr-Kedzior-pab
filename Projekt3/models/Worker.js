"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
class Worker {
    constructor(t) {
        var _a;
        this.id = (_a = t.id) !== null && _a !== void 0 ? _a : Date.now();
        this.name = t.name;
        this.surname = t.surname;
        this.occupation = t.occupation;
    }
}
exports.Worker = Worker;
