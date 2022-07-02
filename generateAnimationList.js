const fs = require('fs');
const list = fs.readdirSync('mixamo/animations');
console.log(`[${list.map(v => JSON.stringify(v)).join(',')}]`);