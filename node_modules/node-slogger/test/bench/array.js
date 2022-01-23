var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;
var a = 'sdfsdf';
var b = '123456';
var c = {abc:'some',cdb:'anther'};
//var data = [a,b,c];
const _push = Array.prototype.push;
function pushArray(args) {
    args.push('aaa');
}

function pushArgs() {
    _push.call(arguments,'aaa');
}

function toPushArray() {
    const len = arguments.length;
    const argsArray = new Array(len);
    for (var i=0;i<len;i++) {
        argsArray[i] = arguments[i];
    }
    pushArray(argsArray);
}

suite.add('args push ',function() {
    pushArgs(a,b,c);
})
.add('array push',function() {
    toPushArray(a,b,c);
})// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({async:true});