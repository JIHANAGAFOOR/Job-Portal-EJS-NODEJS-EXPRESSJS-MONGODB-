var Benchmark = require('benchmark');

var o = {
    f: function f(a, b, c) {
        return [a, b, c];
    }
}, d = "string", e = 123, f = ['a', 'r', 'r', 'a', 'y'];

var suite = new Benchmark.Suite;

// add tests
suite.add('Direct', function() {
    o.f(d, e, f)
})
.add('Call', function() {  	
    o.f.call(o, d, e, f)
})
.add('Apply', function() {
    o.f.apply(o, [d, e, f])
})
.add('ES6',function() {
    o.f(...[d, e, f])
})
.add('es6 call',function() {
    o.f.call(o,...[d,e,f])
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({async:true});