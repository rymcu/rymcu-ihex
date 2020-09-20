<!--
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-09-20 17:45:31
 * @LastEditTime: 2020-09-20 18:07:18
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/README.md
 * @LICENSE
-->

#  Intel HEX parser and writer

## install

```
npm install rymcu-ihex@latest
```

## code

```
const ryhex = require("rymcu-ihex")
const ihex = new ryhex.IHex(false)
ihex.read_file("./led.hex")
ihex.write_file("./led2.hex")
```