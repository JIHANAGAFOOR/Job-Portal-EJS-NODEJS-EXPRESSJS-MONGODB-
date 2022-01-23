const {expect} = require('chai');
const async = require('neo-async');
const Redis = require('ioredis');
const slogger = require('node-slogger');
const SessionToken = require('../index');
const redisClient = new Redis();//connect to the redis server of localhost:6379
const redisSub = new Redis();//the redis client for subscribe
const MAX_SIZE = 8192;
const REDIS_EXPIRE = 10;
const LIFE_RATIO = 0.2;
const lifecycle = REDIS_EXPIRE * LIFE_RATIO * 1000;

const sessionToken = new SessionToken({
    expireTime:REDIS_EXPIRE,//the time of seconds before the session data expired
    redisKeyPrefix:'myprefix:ratiotoken:',//the redis key's prefix
    redis:redisClient,//the redis client object
    subRedis:redisSub,
    maxSize:MAX_SIZE,
    idleCheckInterval:1000,
    memLifecycleRatio:LIFE_RATIO
});

const VALUE = {name:'sunny',id:1};

describe('life ratio test#',function() {
    before(function() {
        slogger.init({level:'debug'});
    });
    it('life ratio',function(done) {
        async.waterfall([
            function(next) {
                sessionToken.generate(VALUE,function(err,tokenViaCreate) {//save session
                    if (err) {
                        return next(err);
                    }
                    next(false,tokenViaCreate);
                });
            },
            function(token,next) {
                const item = sessionToken._cacheInstance.data.get(token);
                
                expect(item).to.be.not.undefined;
                expect(item.expire).to.be.gt(0).and.lte(Date.now() + lifecycle);
                setTimeout(function() {
                    sessionToken.get(token,function(err,value,hitCache) {
                        if (err) {
                            return next(err);
                        }
                        expect(JSON.stringify(value)).to.be.equal(JSON.stringify(VALUE));
                        expect(hitCache).to.be.equal(true);
                        next(false,token);
                    });
                },lifecycle / 2);
            },
            function(token,next) {
                setTimeout(function() {
                    sessionToken.get(token,function(err,value,hitCache) {
                        if (err) {
                            return next(err);
                        }
                        expect(JSON.stringify(value)).to.be.equal(JSON.stringify(VALUE));
                        expect(hitCache).to.be.equal(false);
                        next(false,token);
                    });
                },lifecycle / 2 + 100);
            }
        ],done);
            
    });

});