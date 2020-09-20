/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-19 20:25:26
 * @LastEditTime: 2020-09-20 14:52:40
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/exception.ts
 * @LICENSE
 */

export class IHexNameException extends Error {}
export class IHexValueException extends Error { }
export class IHexNoFileException extends Error { }
export class IHexFileExistsException extends Error {}