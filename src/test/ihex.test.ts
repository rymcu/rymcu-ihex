import { IHex } from '../ihex'

const ihex = IHex.read("./led.hex")
console.log(ihex.extract_data())