// const {expect} = require('chai');
const async = require('neo-async');
const Redis = require('ioredis');
const slogger = require('node-slogger');
const SessionToken = require('../index');
const redisClient = new Redis();//connect to the redis server of localhost:6379
const redisSub = new Redis();//the redis client for subscribe
const MAX_SIZE = 8192;

const sessionToken = new SessionToken({
    expireTime:7200,//the time of seconds before the session data expired
    redisKeyPrefix:'myprefix:useredis:',//the redis key's prefix
    redis:redisClient,//the redis client object
    subRedis:redisSub,
    maxSize:MAX_SIZE,
});

const VALUE = {name:'sunny',id:1};
const LOOP_SIZE = 1020;
const arrayToken = new Array(LOOP_SIZE);
const GET_LOOP_SIZE = LOOP_SIZE / 10;


describe('memory benchmark test',function() {
    before(function() {
        slogger.init({level:'warn'});
    });
    
    it('bench for generate',function(done) {
        async.times(LOOP_SIZE,function(n,next) {
            sessionToken.generate(VALUE,function(err,tokenViaCreate) {//save session
                if (err) {
                    return next(err);
                }
                arrayToken[n] = tokenViaCreate;
                next();
            });
        },done);
    });
    it('get test',function(done) {
        async.times(GET_LOOP_SIZE,function(n,next) {
            sessionToken.get(arrayToken[GET_LOOP_SIZE-1-n],next);
        },done);
    });
    it('get test again',function(done) {
        async.times(GET_LOOP_SIZE,function(n,next) {
            sessionToken.get(arrayToken[n],next);
        },done);
    });
    it('remove all data',function(done) {
        async.each(arrayToken,function(token,next) {
            sessionToken.delete(token,next);
        },done);
    });
    it('recovery log level',function(done) {
        setTimeout(function() {
            slogger.init({level:'trace'});
            done();
        },300);
    });
});