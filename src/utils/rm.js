/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-10-18 10:10:39
 * @LastEditTime: 2020-10-18 10:22:29
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/utils/rm.js
 * @LICENSE: Apache-2.0
 */

const fs = require("fs");
const path = require("path");
const basePath = path.join(__dirname, "../../");
const needRemove = process.argv.slice(2);

needRemove.forEach((rmFile) => {
  const filePath = `${basePath}/${rmFile}`;
  if (fs.existsSync(filePath)) {
    delFile(filePath);
  } else {
    throw Error(`${rmFile} file not exit!`);
  }
});

function delFile(path) {
  if (fs.existsSync(path)) {
    if (fs.statSync(path).isDirectory()) {
      let files = fs.readdirSync(path);
      files.forEach((file, index) => {
        let currentPath = path + "/" + file;
        if (fs.statSync(currentPath).isDirectory()) {
          delFile(currentPath);
        } else {
          fs.unlinkSync(currentPath);
        }
      });
      fs.rmdirSync(path);
    } else {
      fs.unlinkSync(path);
    }
  }
}
