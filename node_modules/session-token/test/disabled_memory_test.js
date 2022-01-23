const {expect} = require('chai');
const Redis = require('ioredis');
const SessionToken = require('../index');
const redisClient = new Redis();//connect to the redis server of localhost:6379
const redisSub = new Redis();//the redis client for subscribe
const sessionToken = new SessionToken({
    expireTime:7200,//the time of seconds before the session data expired
    redisKeyPrefix:'disabled_mem:mytoken:',//the redis key's prefix
    redis:redisClient,//the redis client object
    subRedis:redisSub,
    maxSize:-1
});
const VALUE = {name:'sunny',id:1};
const VALUE_UPDATE = {name:'sunny_new',id:1};
let token = null;

describe('disabled memeory cache test#',function() {
    it ('should generate the first session success',function(done) {
        sessionToken.generate(VALUE,function(err,tokenViaCreate) {//save session
            if (err) {
                return done(err);
            }
            token = tokenViaCreate;
            done();
        });
    });

    it ('should generate the second session success',function(done) {
        sessionToken.generate(VALUE,function(err,tokenViaCreate) {//save session
            if (err) {
                return done(err);
            }
            done();
        });
    });

    it('the memeory cache size should be zero',function(done) {
        sessionToken.getStorageSize(function(err, size) {
            if (err) {
                return done(err);
            }

            expect(size).to.be.equal(0);
            done();
        });
        
    });

    it ('should get success',function(done) {
        sessionToken.get(token,function(err,obj) {
            if (err) {
                return done(err);
            }
            expect(obj).to.have.property('name').and.equal(VALUE.name);
            done();
        });
    });

    it('should update success',function(done) {
        sessionToken.update(token,VALUE_UPDATE,function(err) {
            if (err) {
                return done(err);
            }
            done();
        });
    });
    it('should get new data success',function(done) {
        sessionToken.get(token,function(err,obj) {
            if (err) {
                return done(err);
            }
            expect(obj).to.have.property('name').and.equal(VALUE_UPDATE.name);
            done();
        });
    });

    it('should refresh expire time success',function(done) {
        sessionToken.refresh(token,function(err) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    it('shold delete token success',function(done) {
        sessionToken.delete(token,function(err) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    it ('should call get with no data',function(done) {
        sessionToken.get(token,function(err,obj) {
            if (err) {
                return done(err);
            }
            expect(obj).equal(false);
            done();
        });
    });
});