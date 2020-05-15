const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');

const readFile = file => {
  return fs.readFileSync(file);
};

const writeFile = (file, result) => {
  return fs.writeFileSync(file, result, 'utf8');
}

const getPath = dir => {
  return path.join(__dirname, dir);
};

const convertEucKrToUtf8 = (html) => {
  return iconv.decode(html, 'euc-kr');
}

module.exports = {
  readFile,
  writeFile,
  convertEucKrToUtf8,
  getPath,
};
