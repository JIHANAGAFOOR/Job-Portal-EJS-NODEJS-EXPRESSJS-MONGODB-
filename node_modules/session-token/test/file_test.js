const {expect} = require('chai');
const Redis = require('ioredis');
const path = require('path');
const fs = require('fs');
const SessionToken = require('../index');
const redisClient = new Redis();//connect to the redis server of localhost:6379
const redisSub = new Redis();//the redis client for subscribe
class Wrapper {
    constructor(item) {
        this.name = item.name;
        this.id = item.id;
    }
    get desc() {
        return this.name + ':' + this.id;
    }
}
const SAVE_PATH = '/home/travis/var/session';
const sessionToken = new SessionToken({
    expireTime:7200,//the time of seconds before the session data expired
    redisKeyPrefix:'myprefix:myfile:',//the redis key's prefix
    redis:redisClient,//the redis client object
    subRedis:redisSub,
    wrapperClass: Wrapper,
    cacheDirectory: SAVE_PATH,
    cacheType: 'file'
});
const VALUE = {name:'sunny',id:1};
const VALUE_UPDATE = {name:'sunny_new',id:1};
let token = null;

function _getFilePath(token) {
    return path.join(SAVE_PATH, `${token}.json`);
}

describe('file test',function() {
    it ('should generate success',function(done) {
        sessionToken.generate(VALUE,function(err,tokenViaCreate) {//save session
            if (err) {
                return done(err);
            }
            token = tokenViaCreate;
            done();
        });
    });

    it ('should get success',function(done) {
        sessionToken.get(token,function(err,obj, hit) {
            if (err) {
                return done(err);
            }
            expect(obj).to.have.property('name').and.equal(VALUE.name);
            expect(hit).to.be.equal(true);
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
            expect(obj.desc).to.be.equal(obj.name + ':' + obj.id);
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
    it('the file should not exist', function(done) {
        const filename = _getFilePath(token);
        fs.access(filename, function(err) {
            expect(err).to.have.property('code').and.to.be.equal('ENOENT');
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
    it('the file should not exist', function(done) {
        const filename = _getFilePath(token);
        fs.access(filename, function(err) {
            expect(err).to.have.property('code').and.to.be.equal('ENOENT');
            done();
        });
    });
    it ('should generate success again',function(done) {
        sessionToken.generate(VALUE,function(err,tokenViaCreate) {//save session
            if (err) {
                return done(err);
            }
            token = tokenViaCreate;
            done();
        });
    });
    it('overwirte the token file', function(done) {
        const filename = _getFilePath(token);
        fs.writeFile(filename, "", function(err) {
            done(err);
        });
    });
    it('should get data success even if the file is dirty', function(done) {
        sessionToken.get(token,function(err,obj, hit) {
            if (err) {
                return done(err);
            }
            expect(obj).to.have.property('name').and.equal(VALUE.name);
            expect(hit).to.be.equal(false);
            done();
        });
    });
});