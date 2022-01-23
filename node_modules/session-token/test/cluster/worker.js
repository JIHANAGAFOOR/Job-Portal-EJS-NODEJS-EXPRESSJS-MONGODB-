const Redis = require('ioredis');
const {expect} = require('chai');
var mochaSpawn = require('mocha-spawn');
const SessionToken = require('../../index');
const {nodes,FIRST_VALUE,VALUE_UPDATE} = require('./config');
const redisClient = new Redis(nodes);//connect to the redis server of localhost:6379
const redisSub = new Redis(nodes);//the redis client for subscribe
const sessionToken = new SessionToken({
    expireTime:7200,//the time of seconds before the session data expired
    redisKeyPrefix:'mycluster:mytoken:',//the redis key's prefix
    redis:redisClient,//the redis client object
    subRedis:redisSub,
    subscribeCallback:function(operation,token,value) {
        console.log('subscribe',operation,token,value,'data after subscription :',sessionToken.data);
    },
    cacheWriteCallback:function(token,value) {
        console.log('wirte cache',token+':'+JSON.stringify(value));
    }
});
// var obj = new Proxy(sessionToken.data, {
//     get: function (target, key, receiver) {
//       console.log(`getting ${key}!`);
//       return Reflect.get(target, key, receiver);
//     },
//     set: function (target, key, value, receiver) {
//       console.log(`setting ${key} ${receiver}!`);
//       return Reflect.set(target, key, value, receiver);
//     }
//   });
// const cluster = require('cluster');
// // console.log('is worker',cluster.isWorker);
// // describe('cluster test in worker process',function() {
//     process.on('message', function (message) {
//     // process.send.apply(process, arguments);
//     // This an example of how to disconnect
//     // Ideally you should always have a way to disconnect the echo script
//     // Otherwise your tests will be forever waiting for workers that won't d/c
//         // if ( message.act === 'stop' ) {
//         //     return process.disconnect();
//         // }
//         console.log('message from master',message);
//         switch(message.act) {
//             case 'stop': 
//                 process.disconnect();
//             break;
//             case 'generate':
//                 const token = message.token;
//                         sessionToken.get(token,function(err,value) {
//                             if (err) {
//                                 return console.error(err);
//                             }
//                             expect(value.name).to.be.equal(FIRST_VALUE.name);
//                             expect(value.id).to.be.equal(FIRST_VALUE.id);
//                         });
//             break;
//         }

//     });
// });
// if(typeof process.send === 'function'){ 
    // process.send('what I want to send')
    // };
// process.send('child ready');
console.log('worker cluster',sessionToken.clusterId);
mochaSpawn.onStart(function (opts, done) {
 
    done(false);

});
   
mochaSpawn.onStop(function (opts, done) {

    done(false);

});

mochaSpawn.on('generate', function (token) {
    console.log('child',token);
    // myService.doSomething(params, function (err, results) {

    //     mochaSpawn.send('some-thing-result', err, results);

    // });

    sessionToken.get(token,function(err,value) {
        
        if (err) {
            mochaSpawn.send('child-get-after-generate',err,value);
            return console.error(err);
        }
        expect(value.name).to.be.equal(FIRST_VALUE.name);
        expect(value.id).to.be.equal(FIRST_VALUE.id);
        // console.log('after generate',sessionToken.data.size);
        mochaSpawn.send('child-get-after-generate',err,value);
    });

});
mochaSpawn.on('update',function(token) {
    setTimeout(function() {
        console.log('data before update event get',sessionToken.data);
        sessionToken.get(token,function(err,obj,hitCache) {
            
            if (err) {
                mochaSpawn.send('child-get-after-update',err,obj);
                return console.error(err);
            }
            console.log('child-get-after-update',token,obj,hitCache);
            expect(obj).to.have.property('name').and.equal(VALUE_UPDATE.name);
            mochaSpawn.send('child-get-after-update',err,obj);
        });
    },1000);
    
});

mochaSpawn.on('generate2',function(token) {
    sessionToken.get(token,function(err,obj) {
        mochaSpawn.send('child-get-after-generate2',err,obj);
    });
});

mochaSpawn.on('delete',function(token) {
    setTimeout(function(){
        sessionToken.get(token,function(err,obj) {
            console.log('expect deleted token',token);
            
            if (err) {
                mochaSpawn.send('child-get-after-delete',err,obj);
                return console.error(err);
            }
            //expect(obj).equal(false);
            setTimeout(function() {
                process.exit();
            },1000);
            mochaSpawn.send('child-get-after-delete',err,obj);
        });
    },1000);
    
});