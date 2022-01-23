const slogger = require('node-slogger');
const cronNode = require('node-cron');
const AbstractCache = require('./AbstractCache');
/**
 * @class MemCache
 * @extends AbstractCache
 */
module.exports = class MemCache extends AbstractCache {
    constructor(option) {
        super(option);
        this.data = new Map();
        this._sessionToken = option.sessionToken;
        this.hasOverflow = false;
        this._cacheClearCallback = option.cacheClearCallback;
        this._idleCheckInterval = option.idleCheckInterval;
        this._idleCheckPerCount = option.idleCheckPerCount;
        if (option.showMemSizeInterval > 0) {
            this._showDebugInfo(option.showMemSizeInterval);
        }
        if (option.crontabStr) {
            this._addClearHandler(option.crontabStr);
        }
        this._idleCheck();
    }
    _showDebugInfo(showMemSizeInterval) {
        const _this = this;
        setInterval(function() {
            console.log('current size of data',_this.data.size);
        },showMemSizeInterval);
    };
    _addClearHandler(cron) {
        const _this = this;
    
        cronNode.schedule(cron,function() {
            _this.cacheClearCallback(_this.data.size,_this._historyDataSize);
            _this.removeAll(null,true);
        });
    }
    save(token,value,callback = function() {}) {
        const maxSize = this._maxSize;
        if (maxSize === -1) {
            return callback(null, false);
        }
        if (maxSize > 0) {//with a fixed size limit

            if (this.data.size < maxSize) {
                this.data.set(token,value);
                return callback(null, true);
            }
            if (!this.hasOverflow) {
                slogger.error('maxsize overflow', this.data.size , this.maxSize);
                this.hasOverflow = true;
            }
            callback(null, false);

        } else {//without limit
            this.data.set(token,value);
            callback(null, true);
        }
    }
    _showCapacity() {
        const currentSize = this.data.size;
        const maxSize = this._maxSize;
        if (currentSize < maxSize) {
            if (this.hasOverflow) {
                this.hasOverflow = false;
                slogger.debug('recovery from overflow', currentSize , maxSize);
            }
        }
    }
    remove(token, callback=function() {}) {
        this.data.delete(token);
    
        this._showCapacity();
        callback(null);
    }
    removeAll() {
        this.data.clear();
        this._showCapacity();
    }
    get(token, callback) {
        const item = this.data.get(token);
        return callback(null, item);
    }
    _idleCheck() {
        const _data = this.data;
        const idleCheckPerCount = this._idleCheckPerCount;
        const _this = this;
        setInterval(function _idleLoop() {
            const size = _data.size;
            if (!size) {
                return;
            }
            const keys = _data.keys();
            const now = Date.now();
            for (var i=0;i<idleCheckPerCount;i++) {
                const key = keys.next();
                if (!key) {
                    return;
                }
                const token = key.value;
                if (!token) {
                    return;
                }
                const element = _data.get(token);
                if (!element) {
                    _this.remove(token);
                    return slogger.warn('dirty key-value',token);
                }
                if (element.expire > 0/*need to check*/ && element.expire <= now) {
                    _this.remove(token);
                    slogger.trace(token + 'is expired',_data.size);
                }
            }
        },this._idleCheckInterval);
    }
    update(token, value) {
        const item = this.data.get(token);
        if (item) {
            item.session = value;
            this.save(token, item);
        }
    }
    getSize(callback) {
        callback(null, this.data.size);
    }
    refresh(token, expire, callback) {
        const item = this.data.get(token);
        if (!item) {
            return callback(null);
        }
        item.expire = expire;
        callback(null);
    }
};