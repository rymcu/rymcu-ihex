<!--
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-20 17:45:31
 * @LastEditTime: 2020-09-23 17:27:55
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/README.md
 * @LICENSE
-->

#  Intel HEX parser and writer

## install

```bash
npm install rymcu-ihex@latest
```

## code

```js
const ryhex = require("rymcu-ihex")
const ihex = new ryhex.IHex(false)
// hex buffer 
let hex_buffer = ihex.extract_data()
```