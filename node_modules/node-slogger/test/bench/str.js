var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;
var data = ['sdfsdf','123456'/*,{abc:'some',cdb:'anther'}*/];

suite.add('console string append',function() {

    var str = '';
    for (var i=0,len=data.length;i<len;i++) {
        var element = data[i];
        if (typeof (element) === 'object') {
            str += JSON.stringify(element);
        } else {
            str += element;
        }
    }
    console.log(str);
})
.add('console parameter apply',function() {
    console.log.apply(console,data);
})// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({async:true});