/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-20 13:05:23
 * @LastEditTime: 2020-09-20 13:35:18
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/log.ts
 * @LICENSE
 */

export class Log {
    debug = true

    constructor(debug: boolean) {
        this.debug = false
        this.debug = debug
    }

    s = (s: string) => {
        if (!this.debug) return
        console.log("----------------------------------------------------")
        console.log(`---> func: ${s} start`)
    }

    r = (n: string, s: any, h?: any) => {
        if (!this.debug) return
        if (s && s["toString"]) {
            if (h) {
                console.log(`---> ${n}: ${s.toString(h)}`)
                return
            }
            console.log(`---> ${n}: ${s.toString()}`)
            return
        }
        console.log(`---> ${n}: ${s}`)
    }

    e = (s: string) => {
        if (!this.debug) return
        console.log(`---> func: ${s} end`)
    }
}
