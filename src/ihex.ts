/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-19 20:23:03
 * @LastEditTime: 2020-09-20 21:18:48
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/ihex.ts
 * @LICENSE
 */
import fs from "fs"
import { BHB_E, H1_E, H2_E, I1_E } from './encode'
import { IHexValueException } from './exception'
import { Log } from './log'
import { BHB, H1, H2, I1 } from './parser'

export class IHex {
    debug: boolean = false
    log: Log = null

    start: Buffer = Buffer.from([])
    mode: number = null
    areas: Map<number, Buffer> = new Map()
    row_bytes: number = 16

    constructor(debug: boolean) {
        this.areas = new Map()
        this.start = Buffer.from([])
        this.mode = 8
        this.row_bytes = 16
        this.log = new Log(debug)
        this.debug = debug
    }

    /**
     * Read Intel HEX data from string or lines
     * @param filepath file path
     */
    read(filepath: string): void {
        this.log.s("read")
        this.log.r("filepath", filepath)
        let segbase: number = 0
        this.log.r("segbase", segbase)
        const contents = fs.readFileSync(filepath)
        let line = ""
        for (let ch of contents) {
            if (ch != 0x0A) {
                line += String.fromCharCode(ch)
            } else {
                console.log(line)
                const { line_type, addr, data } = this.parse_line(line.trimLeft())
                console.log("xxxxxxxxxxxxxxxx:", data)
                this.log.r("line_type", line_type)
                this.log.r("addr", addr)
                this.log.r("data", data, "hex")
                if (line_type == 0x00) {
                    this.insert_data(segbase + addr, data)
                } else if (line_type == 0x01) {
                    break;
                } else if (line_type == 0x02) {
                    this.mode = 16
                    segbase = ((H1.parse(data.slice(0, 2)).v1) as any)[0] << 4
                } else if (line_type == 0x03) {
                    this.mode = 16
                    const { v1: cs, v2: ip } = H2.parse(data.slice(0, 2))
                    this.start = Buffer.from([cs, ip])
                } else if (line_type == 0x04) {
                    this.mode = 32
                    segbase = ((H1.parse(data.slice(0, 2)).v1 as any))[0] << 16
                } else if (line_type == 0x05) {
                    this.mode = 32
                    const s = ((I1.parse(data.slice(0, 4)).v1 as any))[0]
                    this.start = Buffer.from(s)
                } else {
                    throw new IHexValueException("Invalid type byte")
                }
                line = ""
            }
        }
        this.log.e("read")
    }


    /**
     * parse line
     * @param rawline file line data
     */
    parse_line(rawline: string) {
        this.log.s("parse_line")
        this.log.r("rawline", rawline)
        if (rawline.slice(0, 1) != ":") {
            throw new IHexValueException(`Invalid line start character ${rawline[0]}`)
        }
        let line: Buffer = Buffer.from([])
        try {
            line = Buffer.from(rawline.slice(1, rawline.length), "hex")
            this.log.r("line", line, "hex")
        } catch (e) {
            throw new IHexValueException("Invalid hex data")
        }
        const { v1: length, v2: addr, v3: line_type } = BHB.parse(line.slice(0, 4))
        this.log.r("length", length)
        this.log.r("addr", addr)
        this.log.r("line_type", line_type)
        const dataend = length + 4
        this.log.r("dataend", dataend)
        const data = line.slice(4, dataend)
        this.log.r("data", data, "hex")
        const cs1 = line[dataend]
        this.log.r("cs1", cs1)
        const cs2 = this.calc_checksum(line.slice(0, dataend))
        this.log.r("cs2", cs2)
        if (cs1 != cs2) {
            throw new IHexValueException("Checksums do not match")
        }
        this.log.e("parse_lien")
        return { line_type, addr, data }
    }

    /**
     * check sum
     * @param data data buffer
     */
    calc_checksum(data: Buffer): number {
        this.log.s("calc_checksum")
        this.log.r("data", data, "hex")
        const total = data.reduce((n, c) => n + c)
        this.log.r("total", total)
        this.log.r("result", (-total) & 0xFF)
        this.log.e("calc_checksum")
        return (-total) & 0xFF
    }


    insert_data(istart: number, idata: Buffer) {
        this.log.s("insert_data")
        this.log.r("istart", istart)
        this.log.r("idata", idata, "hex")
        const iend = istart + idata.length
        this.log.r("iend", iend)
        const area = this.get_area(istart)
        this.log.r("area", area)
        if (!area) {
            this.areas.set(istart, idata)
            this.log.r("this.area", this.areas)
        } else {
            const data = this.areas.get(area)
            this.log.r("data", data, "hex")
            const area_data = Buffer.from([...data.slice(0, istart - area), ...idata, ...data.slice(iend - area, data.length)])
            this.log.r("area_data", area_data, "hex")
            this.areas.set(area, area_data)
            this.log.r("this.areas", this.areas)
        }
        this.log.e("insert_data")
    }

    get_area(addr: number): number {
        this.log.s("get_area")
        this.log.r("addr", addr)
        let iterator = this.areas.keys();
        let r: IteratorResult<number>;
        while (r = iterator.next(), !r.done) {
            const start = r.value
            const data = this.areas.get(start)
            this.log.r("data", data, "hex")
            const end = start + data.length
            this.log.r("start", start)
            this.log.r("end", end)
            this.log.r("addr >= start && addr < end", addr >= start && addr <= end)
            if (addr >= start && addr <= end) {
                return start
            }
        }
        this.log.e("get_area")
        return null
    }

    /**
     * Read Intel HEX data from file
     * @param filepath file path
     */
    read_file(filepath: string): void {
        this.read(filepath)
    }

    /**
     * Set output hex file row width (bytes represented per row).
     */
    set_row_bytes(row_bytes: number) {
        if (row_bytes < 1 || row_bytes > 0xff) {
            throw new IHexValueException(`Value out of range: ${row_bytes}`)
        }
        this.row_bytes = row_bytes
    }


    make_line(line_type: number, addr: number, data: Buffer): string {
        this.log.s("make_line")
        let line: Buffer = BHB_E.encode({ v1: data.length, v2: addr, v3: line_type })
        this.log.r("line", line, "hex")
        line = Buffer.from([...line, ...data])
        this.log.r("line", line, "hex")
        const result = ":" + line.toString("hex").toString().toUpperCase() + this.calc_checksum(line).toString(16) + "\r\n"
        this.log.r("result", result)
        this.log.e("make_line")
        return result
    }

    /**
     * Extract binary data
     * @param start 
     * @param end 
     */
    extract_data(start: number = null, end: number = null) {
        this.log.s("extract_data")
        if (!start) start = 0
        this.log.r("start", start)
        if (!end) {
            let result: Uint8Array = Uint8Array.from([])
            let iterator = this.areas.keys();
            let r: IteratorResult<number>;
            while (r = iterator.next(), !r.done) {
                const addr = r.value
                const data = this.areas.get(start)
                this.log.r("addr", addr)
                this.log.r("data", data, "hex")
                if (addr >= start) {
                    this.log.r("addr >= start", addr >= start)
                    if (result.length < (addr - start)) {
                        this.log.r("result.length < (addr - start)", result.length < (addr - start))
                        const k = Uint8Array.from([addr - start - result.length])
                        result = Uint8Array.from([...result, ...k])
                        this.log.r("result", result)
                    }
                    const s_start = addr - start
                    this.log.r("s_start", s_start)
                    const s_end = addr - start + data.length
                    this.log.r("s_end", s_end)
                    const ar = result.subarray(0, s_start)
                    this.log.r("ar", ar)
                    const br = result.subarray(s_end + 1, result.length)
                    this.log.r("br", br)
                    result = Uint8Array.from([...ar, ...data, ...br])
                    this.log.r("result", result)
                }
            }
            return result
        }
        let result: Uint8Array = Uint8Array.from([])
        let iterator = this.areas.keys();
        let r: IteratorResult<number>;
        while (r = iterator.next(), !r.done) {
            const addr = r.value
            let data = this.areas.get(start)
            this.log.r("addr", addr)
            this.log.r("data", data)
            if (addr >= start && addr < end) {
                data = data.slice(0, end - addr)
                this.log.r("data", data)
                if (data.length < (addr - start)) {
                    this.log.r("data.length < (addr - start)", data.length < (addr - start))
                    const k = Uint8Array.from([addr - start - result.length])
                    this.log.r("k", k)
                    result = Uint8Array.from([...result, ...k])
                    this.log.r("result", result)
                }
                const s_start = addr - start
                this.log.r("s_start", s_start)
                const s_end = addr - start + data.length
                this.log.r("s_end", s_end)
                const ar = result.subarray(0, s_start)
                this.log.r("ar", ar)
                const br = result.subarray(s_end + 1, result.length)
                this.log.r("br", br)
                result = Uint8Array.from([...ar, ...data, ...br])
                this.log.r("result", result)
            }
        }
        this.log.e("extract_data")
        return result
    }

    /**
     * Write Intel HEX data to string
     */
    write(): string {
        this.log.s("write")
        let output = ""
        this.log.r("output", output)
        this.areas = new Map(Array.from(this.areas).sort((a, b) => a[0] - b[0]).map((i) => [i[0], i[1]]));
        let iterator = this.areas.keys();
        let r: IteratorResult<number>;
        while (r = iterator.next(), !r.done) {
            let start = r.value
            const data = this.areas.get(start)
            let i = 0
            let segbase = 0
            while (i < data.length) {
                this.log.r("start", start)
                this.log.r("i", i)
                const chunk = data.slice(i, i + this.row_bytes)
                this.log.r("chunk", chunk, "hex")
                let addr = start
                this.log.r("addr", addr)
                let newsegbase = segbase
                this.log.r("newsegbase", newsegbase)

                if (this.mode == 8) {
                    addr = addr & 0xFFFF
                } else if (this.mode == 16) {
                    let t = addr & 0xFFFF
                    newsegbase = (addr - t) >> 4
                    addr = t
                    if (newsegbase != segbase) {
                        output += this.make_line(0x02, 0, H1_E.encode({ v1: newsegbase }))
                        segbase = newsegbase
                    }
                } else if (this.mode == 32) {
                    newsegbase = addr >> 16
                    addr = addr & 0xFFFF

                    if (newsegbase != segbase) {
                        output += this.make_line(0x04, 0, H1_E.encode({ v1: newsegbase }))
                        segbase = newsegbase
                    }
                }
                this.log.r("addr", addr)
                output += this.make_line(0x00, addr, chunk)
                i += this.row_bytes
                start += this.row_bytes
                this.log.r("output", output)
            }
        }
        if (this.start.length > 0) {
            if (this.mode == 16) {
                const buff = H2_E.encode({ v1: this.start[0], v2: this.start[1] })
                output += this.make_line(0x03, 0, buff)
            } else if (this.mode == 32) {
                const buff = I1_E.encode({ v1: this.start })
                output += this.make_line(0x05, 0, buff)
            }
        }
        output += this.make_line(0x01, 0, Buffer.from(""))
        this.log.r("output", output)
        this.log.e("write")
        return output
    }

    /**
     * Write Intel HEX data to file
     * @param filepath file path
     */
    write_file(filepath: string): void {
        try {
            fs.writeFileSync(filepath, this.write(), { flag: "w" })
        } catch (e) {
            throw e
        }
    }

}
