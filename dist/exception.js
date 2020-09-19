/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-19 20:25:26
 * @LastEditTime: 2020-09-19 20:27:13
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/exception.ts
 * @LICENSE
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IHexValueException = exports.IHexNameException = void 0;
    var tslib_1 = require("tslib");
    var IHexNameException = /** @class */ (function (_super) {
        tslib_1.__extends(IHexNameException, _super);
        function IHexNameException() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return IHexNameException;
    }(Error));
    exports.IHexNameException = IHexNameException;
    var IHexValueException = /** @class */ (function (_super) {
        tslib_1.__extends(IHexValueException, _super);
        function IHexValueException() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return IHexValueException;
    }(Error));
    exports.IHexValueException = IHexValueException;
});
//# sourceMappingURL=exception.js.map