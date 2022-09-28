const requireMe = require('./myRequire');
let str = requireMe('./a');
str = requireMe('./a');
console.log('===', str);