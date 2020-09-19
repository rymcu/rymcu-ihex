(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./exception", "./ihex"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /*
     * @Author: ferried
     * @Email: harlancui@outlook.com
     * @Date: 2020-09-19 20:27:49
     * @LastEditTime: 2020-09-19 20:28:05
     * @LastEditors: ferried
     * @Description: Basic description
     * @FilePath: /rymcu-ihex/src/index.ts
     * @LICENSE
     */
    tslib_1.__exportStar(require("./exception"), exports);
    tslib_1.__exportStar(require("./ihex"), exports);
});
//# sourceMappingURL=index.js.map