/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-22 09:43:31
 * @LastEditTime: 2020-09-22 16:13:17
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/ihex.ts
 * @LICENSE
 */
import fs from "fs"
import { BHB, H1, H2, I1 } from './encode'
import { IHexValueException } from './exception'

export class IHex {

  mode: number = 8
  start: Array<number> = []
  row_bytes = 16
  areas: Map<number, Buffer> = new Map()

  constructor() {
    this.mode = 8
    this.start = []
    this.row_bytes = 16
    this.areas = new Map()
  }

  static read(fname: string): IHex {
    const ihex: IHex = new IHex()
    const contents = fs.readFileSync(fname)
    let line = ""
    let segbase = 0
    for (let ch of contents) {
      if (ch != 0x0A) {
        line += String.fromCharCode(ch)
      } if (ch == 0x0A) {
        line = line.trimLeft().trimEnd()
        const { line_type: t, addr: a, data: d } = ihex.parse_line(line)
        if (t == 0x00) {
          ihex.insert_data(segbase + a, d)
        }
        else if (t == 0x01) { break; }
        else if (t == 0x02) {
          ihex.mode = 16
          segbase = H1.parse(d.slice(0, 2)).v1 << 4
        }
        else if (t == 0x03) {
          ihex.mode = 16
          const { v1: cs, v2: ip } = H2.parse(d.slice(0, 2))
          ihex.start = [cs, ip]
        }
        else if (t == 0x04) {
          ihex.mode = 32
          segbase = H1.parse(d.slice(0, 2)).v1 << 16
        }
        else if (t == 0x05) {
          ihex.mode = 32
          ihex.start = [I1.parse(d.slice(0, 4)).v1]
        } else {
          throw new IHexValueException("Invaild type byte")
        }
        line = ""
      }
    }
    return ihex
  }

  parse_line(rawline: string): any {
    if (rawline[0] != ":") throw new IHexValueException(`Invalid line start character ${rawline[0]}`)
    const line = Buffer.from(rawline.slice(1, rawline.length), "hex")
    const { v1: length, v2: addr, v3: line_type } = BHB.parse(line.slice(0, 4))
    let dataend = length + 4
    let data = line.slice(4, dataend)
    const cs1 = line[dataend]
    const cs2 = this.calc_checksum(line.slice(0, dataend))
    if (cs1 != cs2) new IHexValueException("Checksums do not match")
    return { line_type, addr, data }
  }

  calc_checksum(data: Buffer) {
    return (-(data.reduce((p, n) => p + n))) & 0xff
  }

  insert_data(istart: number, idata: Buffer): void {
    const iend = istart + idata.length
    const area = this.get_area(istart)
    if (area == null) {
      this.areas.set(istart, idata)
    } else {
      const data = this.areas.get(area)
      const area_data = data.slice(0, istart - area).toString("hex") + idata.toString("hex") + data.slice(iend - area, data.length)
      this.areas.set(area, Buffer.from(area_data, "hex"))
    }
  }

  get_area(addr: number): number {
    let iterator = this.areas.keys();
    let r: IteratorResult<number>;
    while (r = iterator.next(), !r.done) {
      const start = r.value
      const data = this.areas.get(start)
      const end = start + data.length
      if (addr >= start && addr <= end) { return start }
    }
    return null
  }

  extract_data(start: number = null, end: number = null): Buffer {
    if (start == null) start = 0
    if (end == null) {
      let result = Buffer.from("", "hex")
      let iterator = this.areas.keys();
      let r: IteratorResult<number>;
      while (r = iterator.next(), !r.done) {
      }
      return result
    }
    let result = Buffer.from("", "hex")
    let iterator = this.areas.keys();
    let r: IteratorResult<number>;
    while (r = iterator.next(), !r.done) {
    
    }
    return result
  }
}
