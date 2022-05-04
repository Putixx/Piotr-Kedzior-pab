"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(t) {
        var _a;
        this.id = (_a = t.id) !== null && _a !== void 0 ? _a : Date.now();
        this.name = t.name;
        this.price = t.price;
        this.quantity = t.quantity;
        this.unitOfMessure = t.unitOfMessure;
    }
}
exports.Product = Product;
