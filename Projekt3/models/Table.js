"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
class Table {
    constructor(t) {
        var _a;
        this.id = (_a = t.id) !== null && _a !== void 0 ? _a : Date.now();
        this.name = t.name;
        this.numPlaces = t.numPlaces;
        this.status = t.status;
    }
}
exports.Table = Table;
