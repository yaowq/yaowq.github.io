let fs = require('fs');
let path = require('path');
let vm = require('vm');

function Module(id) {
  this.id = id; // 文件名
  this.exports = {}; // exports 导出对象
}

Module._resolveFilename = function(filename) {
  // 应该去依次查找 Object.keys(Module._extensions)
  // 默认先获取文件的名字
  filename = path.resolve(filename);
  // 获取文件的扩展名 并判断是否有，若没有就是.js,若有，就采用原来的名字
  let flag = path.extname(filename);
  let extname = flag ? flag : '.js';
  return flag ? filename : (filename + extname);
}

Module._extensions = Object.create(null);

Module.wrapper = [
  '(function(module,exports,require,__dirname,__filename){',
  '})'
]

Module._extensions['.js'] = function(module) { // id exports
  // module.exports = 'hello'
  let content = fs.readFileSync(module.id, 'utf8')
  let strTemplate = Module.wrapper[0] + content + Module.wrapper[1];
  // console.log('111', strTemplate);
  // 希望让这个函数执行，并且，我希望吧exports 传入进去
  let fn = vm.runInThisContext(strTemplate);
  // 模块中的 this 就是 module.exports的对象
  fn.call(module.exports, module, module.exports, requireMe);
}

// json 就是直接将结果放到 module.exports 上
Module._extensions['.json'] = function(module) {
  let content = fs.readFileSync(module.id, 'utf8');
  module.exports = JSON.parse(content);
}

Module.prototype.load = function() {
  // 获取文件的扩展名
  let extname = path.extname(this.id);
  Module._extensions[extname](this);
}

Module._cache = {}; // 缓存对象

function requireMe(filename) {
  let absPath = Module._resolveFilename(filename);
  // console.log(absPath);
  if (Module._cache[absPath]) { // 如果缓存过了，直接将exports 对象返回
    return Module._cache[absPath].exports;
  }
  let module = new Module(absPath);
  // 增加缓存模块
  Module._cache[absPath] = module;
  // 加载
  module.load();
  return module.exports; // 用户将结果赋予给 exports 对象上 默认 require 方法会返回 module.exports 对象
}
module.exports = requireMe;