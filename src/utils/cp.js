/*
 * @Author: ferried
 * @Email: harlancui@outlook.com
 * @Date: 2020-10-18 10:26:07
 * @LastEditTime: 2020-10-18 11:31:45
 * @LastEditors: ferried
 * @Description: Basic description
 * @FilePath: /rymcu-ihex/src/utils/cp.js
 * @LICENSE: Apache-2.0
 */

const fs = require("fs");
const path = require("path");
const targetFiles = process.argv.slice(2);
const baseFile = targetFiles.shift();

targetFiles.forEach((tf) => {
  if (fs.statSync(baseFile).isDirectory()) {
    copyFolderRecursiveSync(baseFile, tf);
  } else {
    copyFileSync(baseFile, tf);
  }
});

function copyFileSync(source, target) {
  var targetFile = target;
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  var files = [];

  var targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  //copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}
