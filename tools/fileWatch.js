const fs = require('fs')
const md5 = require('js-md5')
const path = require('path')
const debounce = require('lodash/debounce')
let filePath = '../public/'
let prevMd5 = null
filePath = path.join(__dirname, filePath)
console.log(filePath)

function fileWatch(){
  fs.watch(filePath, {recursive: true}, debounce((event, filename) => {
    if(filename && event === 'change') {
      var currentMd5 = md5(fs.readFileSync(filePath + filename))
      if(currentMd5 === prevMd5){
        return
      }
      prevMd5 = currentMd5
      console.log(filename)
      console.log(`${filePath + filename}文件发生更新`)
    }
  }, 200))
}

module.exports = fileWatch
