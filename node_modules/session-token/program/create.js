const fs = require('fs');
const path = require('path');
const MAX_SIZE = 1000 * 1000;
console.time('write');
let count = 0;
console.log('pid', process.pid);
function write(stream, i) {
    stream.end(JSON.stringify({index:i}), function(err) {
        stream.destroy();
        if (err) {
            console.error('write error', err);
        }
        count++;
        if (count === MAX_SIZE) {
            console.timeEnd('write');//write: 498283.611ms
        }
    });
}
for(var i=0; i< MAX_SIZE;i++) {
    const filename = path.join(__dirname, 'files/' + i + '.json');
    const stream = fs.createWriteStream(filename);
    write(stream, i);
}
setInterval(function() {}, 1000);