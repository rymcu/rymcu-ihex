/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-19 20:47:02
 * @LastEditTime: 2020-09-20 13:37:09
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/test/ihex.test.ts
 * @LICENSE
 */
import { IHex } from "../ihex";

new IHex(true).read("./led.hex")
// :0C002A00787FE4F6D8FD75810702000322
// 0 42 787fe4f6d8fd758107020003
new IHex(true).make_line(0, 42, Buffer.from([0x78, 0x7f, 0xe4, 0xf6, 0xd8, 0xfd, 0x75, 0x81, 0x07, 0x02, 0x00, 0x03]))