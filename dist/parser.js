(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "binary-parser"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BHB = void 0;
    /*
     * @Author: ferried
     * @Email: harlancui@outlook.com
     * @Date: 2020-09-19 22:07:41
     * @LastEditTime: 2020-09-19 22:09:09
     * @LastEditors: ferried
     * @Description: Basic description
     * @FilePath: /rymcu-ihex/src/parser.ts
     * @LICENSE
     */
    var binary_parser_1 = require("binary-parser");
    exports.BHB = new binary_parser_1.Parser().uint8("length").uint16("addr").uint8("line_type");
});
//# sourceMappingURL=parser.js.map