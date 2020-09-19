(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "fs", "./exception", "./parser"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IHex = void 0;
    var tslib_1 = require("tslib");
    /*
     * @Author: ferried
     * @Email: harlancui@outlook.com
     * @Date: 2020-09-19 20:23:03
     * @LastEditTime: 2020-09-19 22:58:09
     * @LastEditors: ferried
     * @Description: Basic description
     * @FilePath: /rymcu-ihex/src/ihex.ts
     * @LICENSE
     */
    var fs_1 = tslib_1.__importDefault(require("fs"));
    var exception_1 = require("./exception");
    var parser_1 = require("./parser");
    var IHex = /** @class */ (function () {
        function IHex() {
        }
        IHex.read = function (filepath) {
            var e_1, _a;
            var ihex = new IHex();
            var segbase = 0;
            var contents = fs_1.default.readFileSync(filepath);
            var line = "";
            try {
                for (var contents_1 = tslib_1.__values(contents), contents_1_1 = contents_1.next(); !contents_1_1.done; contents_1_1 = contents_1.next()) {
                    var ch = contents_1_1.value;
                    if (ch != 0x0A) {
                        line += String.fromCharCode(ch);
                    }
                    else {
                        this.parse_line(line.trimLeft());
                        line = "";
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (contents_1_1 && !contents_1_1.done && (_a = contents_1.return)) _a.call(contents_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return ihex;
        };
        //     if rawline[0:1] != b":":
        //     raise ValueError("Invalid line start character (%r)" % rawline[0])
        // try:
        //     line = codecs.decode(rawline[1:], "hex_codec")
        // except ValueError:
        //     raise ValueError("Invalid hex data")
        // length, addr, line_type = struct.unpack(">BHB", line[:4])
        // dataend = length + 4
        // data = line[4:dataend]
        // cs1 = line[dataend]
        // cs2 = self.calc_checksum(line[:dataend])
        // if cs1 != cs2:
        //     raise ValueError("Checksums do not match")
        // return (line_type, addr, data)
        IHex.parse_line = function (rawline) {
            console.log(rawline);
            if (rawline.slice(0, 1) != ":") {
                throw new exception_1.IHexValueException("Invalid line start character " + rawline[0]);
            }
            var line = Buffer.from([]);
            try {
                line = Buffer.from(rawline.slice(1, rawline.length), "hex");
            }
            catch (e) {
                throw new exception_1.IHexValueException("Invalid hex data");
            }
            var _a = parser_1.BHB.parse(line), length = _a.length, addr = _a.addr, line_type = _a.line_type;
            console.log(length, addr, line_type);
            var dataend = length + 4;
            console.log(dataend);
            var data = line.slice(4, dataend);
            console.log(data);
            console.log(line[dataend]);
            var cs1 = line[dataend];
            console.log(line.slice(0, dataend));
            var cs2 = this.calc_checksum(line.slice(0, dataend));
            console.log(cs1, cs2);
            if (cs1 != cs2) {
                throw new exception_1.IHexValueException("Checksums do not match");
            }
            return { line_type: line_type, addr: addr, data: data };
        };
        IHex.calc_checksum = function (data) {
            var total = data.reduce(function (n, c) { return n + c; });
            return (-total) & 0xFF;
        };
        return IHex;
    }());
    exports.IHex = IHex;
});
//# sourceMappingURL=ihex.js.map