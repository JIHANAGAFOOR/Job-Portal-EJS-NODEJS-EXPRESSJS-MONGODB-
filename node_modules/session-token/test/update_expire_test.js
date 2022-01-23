const {expect} = require('chai');
const async = require('neo-async');
const Redis = require('ioredis');
const slogger = require('node-slogger');
const SessionToken = require('../index');
const redisClient = new Redis();//connect to the redis server of localhost:6379
const redisSub = new Redis();//the redis client for subscribe
const MAX_SIZE = 8192;
const REDIS_EXPIRE = 3600;

const sessionToken = new SessionToken({
    expireTime:REDIS_EXPIRE,//the time of seconds before the session data expired
    redisKeyPrefix:'myprefix:updatetoken:',//the redis key's prefix
    redis:redisClient,//the redis client object
    subRedis:redisSub,
    maxSize:MAX_SIZE,
    idleCheckInterval:1000,
});

const VALUE = {name:'sunny',id:1};
let token = null;
let ttl = 0;
let expire = 0;
describe('ignore update test#',function() {
    before(function() {
        slogger.init({level:'debug'});
    });
    it('first update without refresh and then with refresh',function(done) {
        async.waterfall([
            function(next) {
                sessionToken.generate(VALUE,function(err,tokenViaCreate) {//save session
                    if (err) {
                        return next(err);
                    }
                    token = tokenViaCreate;
                    next(false);
                });
            },
            function(next) {
                redisClient.ttl(sessionToken.redisKeyPrefix + token,function(err,reply) {
                    if (err) {
                        return next(err);
                    }
                    ttl = Number(reply);
                    expect(ttl).to.be.lte(REDIS_EXPIRE).and.gt(REDIS_EXPIRE - 20);
                    sessionToken._getFromStorage(token, function(err, mem) {
                        if (err) {
                            return next(err);
                        }
                        expire = mem.expire;
                        expect(expire).to.be.gt(0);
                        next();
                    });
                    
                });
            },
            function(next) {
                setTimeout(function() {
                    next();
                },3000);
            },
            function(next) {
                sessionToken.update(token,{name:'x',id:1},function(err) {
                    if (err) {
                        return next(err);
                    }
                    sessionToken._getFromStorage(token, function(err, mem) {
                        if (err) {
                            return next(err);
                        }
                        expect(mem.expire).to.be.equal(expire);
                        next();
                    });
                    
                },true)
            },
            function(next) {
                redisClient.ttl(sessionToken.redisKeyPrefix + token,function(err,reply) {
                    if (err) {
                        return next(err);
                    }
                    const newttl = Number(reply);
                    expect(newttl).to.be.lt(ttl).and.gt(0);
                    ttl = newttl;
                    next();
                });
            },
            
            function(next) {
                sessionToken.update(token,{name:'y',id:1},function(err) {
                    if (err) {
                        return next(err);
                    }
                    sessionToken._getFromStorage(token, function(err, mem) {
                        if (err) {
                            return next(err);
                        }
                        expect(mem.expire).to.be.gt(expire);
                        next();
                    });
                    
                });
            },
            function(next) {
                redisClient.ttl(sessionToken.redisKeyPrefix + token,function(err,reply) {
                    if (err) {
                        return next(err);
                    }
                    const newttl = Number(reply);
                    expect(newttl).to.be.gt(ttl);
                    ttl = newttl;
                    next();
                });
            },
        ],done);
            
    });

});