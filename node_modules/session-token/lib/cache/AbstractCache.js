/**
 * @callback WithErrorCallback
 * @param {Error|String} err
 */
/**
 * @callback WithDataCallback
 * @param {Error|String} err
 * @param {Object} item
 */
/**
 * @callback SizeCallback
 * @param {Error|String} err
 * @param {Number} size
 */
/**
 * @callback SaveCallback
 * @param {Error|String} err
 * @param {Boolean} isAddedToCache Whether add it to the cache storage. It can be false if the count of elements in memory storage is overflow.
 */
/**
 * @class AbstractCache
 * @abstract
 */
module.exports = class AbstractCache {
    /**
     * @constructor
     * @param {Object} option 
     * @param {Number} option.maxSize The max size of element that can be saved in cache.
     */
    constructor(option) {
        this._maxSize = option.maxSize;
    }
    /**
     * save one session
     * @param  {String} token
     * @param  {TokenCacheItem} item
     * @param  {SaveCallback} callback
     */
    save(token,item,callback) {
        throw new Error('not supported');
    }
    /**
     * remove one session via token
     * @param {String} token
     * @param {WithErrorCallback} callback
     */
    remove(token, callback=function() {}) {
        throw new Error('not supported');
    }
    /**
     * remove all session data from cache
     */
    removeAll() {
        throw new Error('not supported');
    }
    /**
     * get one session via token
     * 
     * @param  {String} token
     * @param  {WithDataCallback} callback
     */
    get(token, callback) {
        throw new Error('not supported');
    }
    /**
     * Update the session data async via token
     * @param  {String} token
     * @param  {Object} value
     */
    update(token, value) {
        throw new Error('not supported');
    }
    /**
     * Get the total count of elements save in cache.
     * 
     * @param  {SizeCallback} callback
     */
    getSize(callback) {
        throw new Error('not supported');
    }
    /**
     * Refresh the expire time in cache via token.
     * 
     * @param  {String} token
     * @param  {Number} expired
     * @param  {WithErrorCallback} callback
     */
    refresh(token, expired, callback) {
        throw new Error('not supported');
    }
};