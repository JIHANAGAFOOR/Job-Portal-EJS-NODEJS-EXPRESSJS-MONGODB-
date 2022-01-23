const slogger = require('node-slogger');
const fs = require('fs');
const path = require('path');
const AbstractCache = require('./AbstractCache');
/**
 * @class FileCache
 * @extends AbstractCache
 */
module.exports = class FileCache extends AbstractCache {
    constructor(option) {
        super(option);
        this._cacheDirectory = option.cacheDirectory;
        this._encoder = option.encoder || JSON.stringify;
        this._decoder = option.decoder || JSON.parse;
        this._scan();
    }
    _getFilePath(token) {
        return path.join(this._cacheDirectory, `${token}.json`);
    }
    save(token,item,callback = function() {}) {
        const filename = this._getFilePath(token);
        fs.writeFile(
            filename, 
            this._encoder(item), 
            function(err) {
                callback(err, !!err);
        });
    }
    remove(token, callback) {
        const filename = this._getFilePath(token);
        fs.unlink(filename, function(err) {
            callback(err, !!err);
        });
    }
    get(token, callback) {
        const filename = this._getFilePath(token);
        const _this = this;
        fs.readFile(filename, function(err, data) {
            if (err) {
                if (err.code === 'ENOENT') {
                    return callback(null, null);
                }
                slogger.debug(`read token file ${filename} error`, err);
                return callback(err);
            }
            try {
                data = _this._decoder(data.toString());
            } catch (e) {
                slogger.warn(`dirty token data from ${filename}`, data);
                return callback(e);
            }
            callback(null, data);
        });
    }
    _scan() {

    }
    idleCheck() {
        
    }
    update(token, value) {
        const _this = this;
        this.get(token, function(err, item) {
            if (err) {
                slogger.warn('get token error', token, err);
                return;
            }
            if (!item) {
                return;
            }
            item.session = value;
            _this.save(token, item, function(err) {
                if (err) {
                    slogger.warn('save token error', token, err);
                }
            });
        });
    }
    getSize(callback) {
        fs.readdir(this._cacheDirectory, function(err, files) {
            if (err) {
                return callback(err);
            }
            return callback(null, files.length);
        });
    }
    refresh(token, expire, callback) {
        const _this = this;
        this.get(token, function(err, item) {
            if (err) {
                callback(err);
                return;
            }
            if (!item) {
                return callback(null);
            }
            item.expire = expire;
            _this.save(token, item, function(err) {
                callback(err);
            });
        });
    }
};