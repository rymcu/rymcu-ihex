/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-20 19:18:43
 * @LastEditTime: 2020-09-20 19:19:38
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/test/ihex.test.ts
 * @LICENSE
 */
import {IHex} from '../ihex'

const ihex = new IHex(true)
ihex.read_file("./factory.hex")
ihex.write_file("./led2.hex")