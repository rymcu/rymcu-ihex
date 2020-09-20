/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-20 12:19:01
 * @LastEditTime: 2020-09-20 12:41:35
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/encode.ts
 * @LICENSE
 */
import { Parser } from './binary_parser'

export const BHB_E = new Parser().uint8("v1").uint16("v2").uint8("v3")
export const H1_E = new Parser().uint16("v1")
export const H2_E = new Parser().uint16("v1").uint16("v2")
export const I1_E = new Parser().uint32("v1")