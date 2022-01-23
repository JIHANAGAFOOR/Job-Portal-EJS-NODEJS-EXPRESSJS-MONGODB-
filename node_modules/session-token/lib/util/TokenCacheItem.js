/**
 * @class TokenCacheItem
 * @property {Number} expire The timestamp when it expire.
 * @property {Object} session The session value
 */
module.exports = class TokenCacheItem {
    constructor(expire, session) {
        this.expire = expire;
        this.session = session;
    }
};