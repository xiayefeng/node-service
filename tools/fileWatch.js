const fs = require('fs')
const md5 = require('js-md5')
const path = require('path')
const debounce = require('lodash/debounce')
let filePath = '../public/'
let prevMd5 = null
filePath = path.join(__dirname, filePath)
// console.log(filePath)

function fileWatch(cb){
  fs.watch(filePath, {recursive: true}, debounce((event, filename) => {
    //  console.log(path.parse(filePath + filename).ext)
    if(filename && event === 'change' && filename.includes('.')) { // 只有文件变化才刷新，防止新建文件或删除文件后读取文件报错 此处要注意文件夹命名规范，一般不要带用带.的文件夹名
      // console.log(filename)
      var ext = path.parse(filePath + filename).ext
      // console.log(ext)
      if(!['.js', '.html', '.css'].includes(ext)){ // 只有 js, html, css文件变动时才会刷新页面
        return
      }
      var currentMd5 = md5(fs.readFileSync(filePath + filename)) // 文件 md5值，用于防止文件未更改刷新
      if(currentMd5 === prevMd5){
        return
      }
      prevMd5 = currentMd5
      // console.log(filename)
      // console.log(`${filePath + filename}文件发生更新`)
      cb && cb(filename) // 文件变化后调用回调，并传变化的文件为参数
    }
  }, 300))
}

module.exports = fileWatch
