/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-20 19:18:43
 * @LastEditTime: 2020-09-20 20:53:49
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/test/ihex.test.ts
 * @LICENSE
 */
import { IHex } from '../ihex'

const ihex = new IHex(true)
ihex.read_file("./led.hex")
console.log(Array.from(ihex.areas).map((v) => {
    console.log(v[0], v[1].toString("hex"))
}))

ihex.extract_data()
ihex.write_file("./led2.hex")