# v1.0.2
## Fix
1. Fixed the issue of not clearing the cache used to write files.
## Add
1. Add the millisecond of the time string.

# v1.0.1
## Fix
1. Fixed the problem of not supporting the node of v0.x

# v1.0.0
## Remove
1. Discard the support of third-part log library.
2. Remove some unused function.
## Add
1. Add the function of saving log to files.


# v0.5.3
## Remove
1. Discard the call of `toUpperCase`.

# v0.5.2
## Fix
1. Finally resolved the issue of memory leak cased by `console.log`, also see the issue [#1741](https://github.com/nodejs/node/issues/1741) of node.
    
# v0.5.1
## Fix
1. Fix the issue of breaking down when you lack log4js or winston even if you not need it.

# v0.5.0
## Fix
1. Fix the bug of memory leak.

# v0.4.3
## Fix
1. Fix the color not recover problem.

# v0.4.2
## Fix
1. Fixed color not show problem.

# v0.4.1
## Improve
1. Improve the performance of custom console log.

# v0.4.0
## Add
1. Add delay console feature.

# v0.3.0
## Add
1. Improve the performance of the `print` function.

# v0.2.0 
## Add
1. Add `time` `timeEnd` function and the const of `TIME_LEVEL_VALUE`, which is the default level of slogger.

# v0.1.0
## Add
1. Add support of winston.
2. Refactor the code.

# v0.0.3 
## Add
1. Use console to print log if not given the instances of logger.

# v0.0.2
## Fix
1. Check whether the logger object exists before call its function.

# v0.0.1 
## Add
1. Project init.