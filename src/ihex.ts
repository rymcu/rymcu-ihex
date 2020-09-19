/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-19 20:23:03
 * @LastEditTime: 2020-09-19 23:21:25
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/ihex.ts
 * @LICENSE
 */
import fs from "fs"
import { IHexValueException } from './exception'
import { BHB, H1, H2, I1 } from './parser'

export class IHex {
    static read(filepath: string): IHex {
        const ihex: IHex = new IHex()
        let segbase: number = 0
        const contents = fs.readFileSync(filepath)
        let line = ""
        for (let ch of contents) {
            if (ch != 0x0A) {
                line += String.fromCharCode(ch)
            }
            else {
                const { line_type, addr, data } = this.parse_line(line.trimLeft())
                if (line_type == 0x00) {
                    ihex.inser_data(segbase + addr, data)
                } else if (line_type == 0x01) {
                    break;
                } else if (line_type == 0x02) {
                    ihex.set_mode(16)
                    segbase = ((H1.parse(data.slice(0, 2)).v1) as any)[0] << 4
                } else if (line_type == 0x03) {
                    ihex.set_mode(16)
                    const { v1: cs, v2: ip } = H2.parse(data.slice(0, 2))
                    ihex.set_start(cs, ip)
                } else if (line_type == 0x04) {
                    ihex.set_mode(16)
                    segbase = ((H1.parse(data.slice(0, 2)).v1 as any))[0] << 16
                } else if (line_type == 0x05) {
                    ihex.set_mode(32)
                    ihex.set_start(((H1.parse(data.slice(0, 4)).v1 as any))[0])
                } else {
                    throw new IHexValueException("Invalid type byte")
                }
            }
            line = ""
        }
        return ihex
    }


    // return (line_type, addr, data)
    static parse_line(rawline: string) {
        if (rawline.slice(0, 1) != ":") {
            throw new IHexValueException(`Invalid line start character ${rawline[0]}`)
        }
        let line: Buffer = Buffer.from([])
        try {
            line = Buffer.from(rawline.slice(1, rawline.length), "hex")
        } catch (e) {
            throw new IHexValueException("Invalid hex data")
        }
        const { v1: length, v2: addr, v3: line_type } = BHB.parse(line)
        const dataend = length + 4
        const data = line.slice(4, dataend)
        const cs1 = line[dataend]
        const cs2 = this.calc_checksum(line.slice(0, dataend))
        if (cs1 != cs2) {
            throw new IHexValueException("Checksums do not match")
        }
        return { line_type, addr, data }
    }

    static calc_checksum(data: Buffer): number {
        const total = data.reduce((n, c) => n + c)
        return (-total) & 0xFF
    }


    set_start(cs: number, ip?: number) { }
    set_mode(n: number) { }
    inser_data(n: number, d: any) { }
}
