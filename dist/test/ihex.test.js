(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../ihex"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
     * @Author: ferried
     * @Email: harlancui@outlook.com
     * @Date: 2020-09-19 20:47:02
     * @LastEditTime: 2020-09-19 20:51:21
     * @LastEditors: ferried
     * @Description: Basic description
     * @FilePath: /rymcu-ihex/src/test/ihex.test.ts
     * @LICENSE
     */
    var ihex_1 = require("../ihex");
    ihex_1.IHex.read("./led.hex");
});
//# sourceMappingURL=ihex.test.js.map