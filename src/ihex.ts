/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-19 20:23:03
 * @LastEditTime: 2020-09-20 13:45:15
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/ihex.ts
 * @LICENSE
 */
import fs from "fs"
import { BHB_E } from './encode'
import { IHexValueException } from './exception'
import { Log } from './log'
import { BHB, H1, H2, I1 } from './parser'

export class IHex {
    debug: boolean = false
    log: Log = null

    start: Buffer = Buffer.from([])
    mode: number = null
    areas: Map<number, Buffer> = new Map()
    row_bytes = 16

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
    read(filepath: string): IHex {
        this.log.s("read")
        let segbase: number = 0
        this.log.r("segbase", segbase)
        const contents = fs.readFileSync(filepath)
        let line = ""
        for (let ch of contents) {
            if (ch != 0x0A && ch != 0x0D) {
                line += String.fromCharCode(ch)
            } else {
                const { line_type, addr, data } = this.parse_line(line.trimLeft())
                if (line_type == 0x00) {
                    this.inser_data(segbase + addr, data)
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
        return this
    }


    /**
     * parse line
     * @param rawline file line data
     */
    parse_line(rawline: string) {
        this.log.s("parse_line")
        this.log.r("parse_line", rawline)
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
        const { v1: length, v2: addr, v3: line_type } = BHB.parse(line)
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


    inser_data(istart: number, idata: Buffer) {
        const iend = istart + idata.length
        const area = this.get_area(istart)
        if (!area) {
            this.areas.set(istart, idata)
        } else {
            const data = this.areas.get(area)
            const area_data = Buffer.from([...data.slice(0, istart - area), ...idata, ...data.slice(iend - area, -1)])
            this.areas.set(area, area_data)
        }
    }

    get_area(addr: number): number {
        this.areas.forEach((data, start) => {
            const end = start + data.length
            if (addr >= start && addr < end) {
                return start
            }
        })
        return null
    }

    /**
     * Read Intel HEX data from file
     * @param filepath file path
     */
    read_file(filepath: string): IHex {
        const ihex = new IHex(this.debug)
        ihex.read_file(filepath)
        return ihex
    }

    /**
     * Set output hex file row width (bytes represented per row).
     */
    set_row_bytes() { }

    /**
     * Extract binary data
     */
    extract_data() { }

    make_line(line_type: number, addr: number, data: Buffer): string {
        let line: Buffer = BHB_E.encode({ v1: data.length, v2: addr, v3: line_type })
        line = Buffer.from([...line, ...data])
        const result = ":" + line.toString("hex").toString().toUpperCase() + this.calc_checksum(line).toString(16) + "\r\n"
        return result
    }

    /**
     * Write Intel HEX data to string
     */
    write(): string {
        return null
    }

    /**
     * Write Intel HEX data to file
     */
    write_file(filepath: string) {

    }


}
