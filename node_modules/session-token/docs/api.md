## Classes

<dl>
<dt><a href="#SessionToken">SessionToken</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#cacheFactory">cacheFactory(cacheType)</a> ⇒ <code>AbstractCache</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SubscribeCallback">SubscribeCallback</a> : <code>function</code></dt>
<dd><p>The callback function , which will be triggered when new message form redis subscription.</p>
</dd>
<dt><a href="#CacheWriteCallback">CacheWriteCallback</a> : <code>function</code></dt>
<dd><p>The callback function ,which will be called when data is cached into memory.</p>
</dd>
<dt><a href="#CacheClearCallback">CacheClearCallback</a> : <code>function</code></dt>
<dd><p>The callback function, which will be called when data is cleared.</p>
</dd>
<dt><a href="#SessionTokenOption">SessionTokenOption</a></dt>
<dd></dd>
<dt><a href="#SessionTokenCallback">SessionTokenCallback</a> : <code>function</code></dt>
<dd><p>SessionToken callback function.</p>
</dd>
</dl>

<a name="SessionToken"></a>

## SessionToken
**Kind**: global class  

* [SessionToken](#SessionToken)
    * [new SessionToken(option)](#new_SessionToken_new)
    * [.generate(value, callback, [id])](#SessionToken+generate)
    * [.update(token, value, callback, [ignoreRefresh])](#SessionToken+update)
    * [.refresh(token, callback)](#SessionToken+refresh)
    * [.get(token, callback)](#SessionToken+get)
    * [.delete(token, callback)](#SessionToken+delete)

<a name="new_SessionToken_new"></a>

### new SessionToken(option)

| Param | Type |
| --- | --- |
| option | [<code>SessionTokenOption</code>](#SessionTokenOption) | 

<a name="SessionToken+generate"></a>

### sessionToken.generate(value, callback, [id])
Genrate a new token and save its associated data in redis and memeory.

**Kind**: instance method of [<code>SessionToken</code>](#SessionToken)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Object</code> | The value of session |
| callback | [<code>SessionTokenCallback</code>](#SessionTokenCallback) |  |
| [id] | <code>String</code> | Save data with given id, use random key if not set. |

<a name="SessionToken+update"></a>

### sessionToken.update(token, value, callback, [ignoreRefresh])
Update the content of session.

**Kind**: instance method of [<code>SessionToken</code>](#SessionToken)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| token | <code>String</code> |  |  |
| value | <code>Object</code> |  | The value of session |
| callback | [<code>SessionTokenCallback</code>](#SessionTokenCallback) |  |  |
| [ignoreRefresh] | <code>Boolean</code> | <code>false</code> | if set true, it will not refresh the expire time of the key. |

<a name="SessionToken+refresh"></a>

### sessionToken.refresh(token, callback)
Refresh the expire time of session data saved in redis and memeory.

**Kind**: instance method of [<code>SessionToken</code>](#SessionToken)  

| Param | Type |
| --- | --- |
| token | <code>String</code> | 
| callback | [<code>SessionTokenCallback</code>](#SessionTokenCallback) | 

<a name="SessionToken+get"></a>

### sessionToken.get(token, callback)
Get session data via token

**Kind**: instance method of [<code>SessionToken</code>](#SessionToken)  

| Param | Type |
| --- | --- |
| token | <code>String</code> | 
| callback | [<code>SessionTokenCallback</code>](#SessionTokenCallback) | 

<a name="SessionToken+delete"></a>

### sessionToken.delete(token, callback)
Delete session data via token

**Kind**: instance method of [<code>SessionToken</code>](#SessionToken)  

| Param | Type |
| --- | --- |
| token | <code>String</code> | 
| callback | [<code>SessionTokenCallback</code>](#SessionTokenCallback) | 

<a name="cacheFactory"></a>

## cacheFactory(cacheType) ⇒ <code>AbstractCache</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| cacheType | <code>String</code> | 

<a name="SubscribeCallback"></a>

## SubscribeCallback : <code>function</code>
The callback function , which will be triggered when new message form redis subscription.

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| operation | <code>String</code> | 
| token | <code>String</code> | 
| [value] | <code>String</code> | 

<a name="CacheWriteCallback"></a>

## CacheWriteCallback : <code>function</code>
The callback function ,which will be called when data is cached into memory.

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| token | <code>String</code> | 
| value | <code>String</code> | 

<a name="CacheClearCallback"></a>

## CacheClearCallback : <code>function</code>
The callback function, which will be called when data is cleared.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>Number</code> | The size of data cached in memory. |

<a name="SessionTokenOption"></a>

## SessionTokenOption
**Kind**: global typedef  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [expireTime] | <code>Number</code> | <code>0</code> | Expiration time in second, default is 0, which will be not expired, but when you set the paramter of `option.crontabStr`, it will be cleared at some time still. |
| redisKeyPrefix | <code>String</code> |  | The prefix of redis key to save session data |
| reids | <code>Object</code> |  | The redis client used to save session data |
| [subRedis] | <code>Object</code> |  | The subscribe redis client to receive delete operation form other node.js process, it's useful when you start node in cluster mode. |
| [crontabStr] | <code>String</code> |  | Crontab string, use for clearing the memeory cache. |
| [maxSize] | <code>Number</code> | <code>0</code> | The max size of the cache, default is 0, which will not limit the size of cache. When it passed as -1, the cache in memory or file will be disabled. |
| [clusteId] | <code>String</code> |  | An id of current process, when not set, it will use random string.  When do the operation of delete or update, SessionToken will publish a message, which is started with a perfix of current clusterId, to redis. Then all the  processes will receive the message  and read the clusterId of the message to check whether it from self. But when the subRedis is not set, the `clusterId` is useless now. |
| [subscribeCallback] | [<code>SubscribeCallback</code>](#SubscribeCallback) |  | The callback function , which will be triggered when new message form redis subscription. |
| [cacheWriteCallback] | [<code>CacheWriteCallback</code>](#CacheWriteCallback) |  |  |
| [cacheClearCallback] | [<code>CacheClearCallback</code>](#CacheClearCallback) |  |  |
| [showMemSizeInterval] | <code>Number</code> | <code>0</code> | To show the current count of cache in memeory at `showMemSizeInterval` ms. When passed 0 , it will disabled. |
| [idleCheckInterval] | <code>Number</code> | <code>0</code> | The interval of checking whether the item cached in memory is expired, default is 0, which will disable the checking. Only If both the parameter of `expireTime` and `idleCheckInterval` is  greater than 0 , the SesssionToken will enable the process of checking. |
| [idleCheckPerCount] | <code>Number</code> | <code>30</code> | The count of items to check in one loop of the idle checking. |
| [memLifecycleRatio] | <code>Float</code> | <code>1.0</code> | The lifecycle of the memeory cache, default is 1.0 , which means that it equals to the lifecycle of redis cache. |
| [wrapperClass] | <code>Class</code> |  | The class which will use to |
| [cacheDirectory] | <code>String</code> |  | The directory which will been used to save cache data in it. When this parameter is given, SessionToken will cache the data in files, otherwise it will cache the data in memory. |
| [encoder] | <code>function</code> | <code>JSON.stringify</code> | The encode function used by FileCache. |
| [decoder] | <code>function</code> | <code>JSON.parse</code> | The decode function used by FileCache. |
| [cacheType] | <code>String</code> | <code>memory</code> | The cache type used to store the session data fetched from redis. You can set it to `memory` or `file`. |

<a name="SessionTokenCallback"></a>

## SessionTokenCallback : <code>function</code>
SessionToken callback function.

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| err | <code>Error</code> | 
| data | <code>Object</code> \| <code>String</code> \| <code>undefined</code> | 
| hitMemCache | <code>Boolean</code> | 

