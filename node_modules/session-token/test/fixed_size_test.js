const {expect} = require('chai');
const async = require('neo-async');
const Redis = require('ioredis');
const slogger = require('node-slogger');
const SessionToken = require('../index');
const redisClient = new Redis();//connect to the redis server of localhost:6379
const redisSub = new Redis();//the redis client for subscribe
const MAX_SIZE = 10240;
const sessionToken = new SessionToken({
    expireTime:7200,//the time of seconds before the session data expired
    redisKeyPrefix:'myprefix:mytoken:',//the redis key's prefix
    redis:redisClient,//the redis client object
    subRedis:redisSub,
    maxSize:MAX_SIZE,
    // useLru:true
});
const VALUE = {name:'sunny',id:1};
const VALUE_UPDATE = {name:'sunny_new',id:1};
let token = null;

describe('fixed max size test',function() {
    before(function() {
        slogger.init({level:'warn'});
    });
    it ('should generate ' + MAX_SIZE + '*2 tokens success',function(done) {
        async.times(MAX_SIZE * 2,function(n,next) {
            sessionToken.generate(VALUE,function(err/*,tokenViaCreate*/) {//save session
                if (err) {
                    return next(err);
                }
                
                next();
            });
        },done);
        
    });

    it ('should only cache '+MAX_SIZE+' tokens in memory ',function(done) {

        sessionToken.generate(VALUE,function(err,tokenViaCreate) {//save session
            if (err) {
                return done(err);
            }
            sessionToken.getStorageSize(function(err, size) {
                if (err) {
                    return done(err);
                }
    
                expect(size).to.be.equal(MAX_SIZE);
                token = tokenViaCreate;
                done();
            });
            
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