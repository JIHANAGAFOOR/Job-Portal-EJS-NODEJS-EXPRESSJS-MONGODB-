const {expect} = require('chai');
const async = require('neo-async');
const Redis = require('ioredis');
const slogger = require('node-slogger');
const SessionToken = require('../index');
const redisClient = new Redis();//connect to the redis server of localhost:6379
const redisSub = new Redis();//the redis client for subscribe

const VALUE = {name:'sunny',id:1};
const LOOP_SIZE = 1024 * 50;
const CHECK_TIMES = 10;
const MAX_SIZE = LOOP_SIZE;// 8192;

const sessionTokenWithLru = new SessionToken({
    expireTime:1,//the time of seconds before the session data expired
    redisKeyPrefix:'myprefix:idletoken:',//the redis key's prefix
    redis:redisClient,//the redis client object
    subRedis:redisSub,
    maxSize:MAX_SIZE,
    // useLru:true,
    idleCheckInterval:1000,
});


// const LruToken = new Array(LOOP_SIZE);
// const GET_LOOP_SIZE = LOOP_SIZE / 10;


describe('idle check test',function() {
    before(function() {
        slogger.init({level:'debug'});
    });
    it('bench for idle',function(done) {
        async.times(LOOP_SIZE,function(n,next) {
            sessionTokenWithLru.generate(VALUE,function(err/*,tokenViaCreate*/) {//save session
                if (err) {
                    return next(err);
                }
                // LruToken[n] = tokenViaCreate;
                next();
            });
        },done);
    });

    it('show mem size',function(done) {
        async.timesSeries(CHECK_TIMES,function(i,next) {
            setTimeout(function() {
                sessionTokenWithLru.getStorageSize(function(err, size) {
                    if (err) {
                        return done(err);
                    }
        
                    console.log(
                        'current mem size',
                        // sessionTokenWithLru._lruList.size(),
                        sessionTokenWithLru._cacheInstance.data.size,
                        sessionTokenWithLru._historyDataSize
                    );
                    next();
                });
                
                
            },1000);
        },function() {
            done();
        });
        
        
    });
});