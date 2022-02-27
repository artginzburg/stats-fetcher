require('dotenv').config();

console.time();
require('.')('data.json').then(console.timeEnd);
