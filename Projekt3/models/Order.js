"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor(t) {
        var _a, _b;
        this.id = (_a = t.id) !== null && _a !== void 0 ? _a : Date.now();
        this.worker = t.worker;
        this.meals = (_b = t.meals) !== null && _b !== void 0 ? _b : [];
        this.status = t.status;
        this.table = t.table;
        this.price = t.price;
    }
}
exports.Order = Order;
