# aurelia-cached-getter

Provides a replacement for Aurelia's `HttpClient` library, designed to
assist in creating an offline-capable app. It is not meant to replace
`HttpClient` for all GET requests, as described below.

The `HttpCachedGetter` class overrides `HttpClient.get()` to ensure two things:

* All successful GET requests are cached into local storage
* Any GET requests made while offline are retrieved from local storage

Specifically absent from this library:

* No other verbs are handled. If you want to cache the values that you POST
   to your server, you must do so manually. (See below.)
* In fact, if you use an `HttpCachedGetter` object to run a POST query,
   it will silently pass through to the main `HttpClient` library.
* No timeouts are installed. If the client is online but the server is offline
   or otherwise fails, the cache is not consulted as a fallback.
* No cache management is provided. You are responsible for cleaning out old
   data, and ensuring that local storage remains a reasonable size.

As you can see, this library is designed to provide a simple and thin 
wrapper for building an offline-capable app.

# Dependencies

This library provides a subclass replacement for `HttpClient`. As such, it
depends on the [aurelia-http-client](https://github.com/aurelia/http-client) package.
If you are using a different library for managing your XHR requests, then
this isn't for you.

# Basic usage

To install:

```
jspm install github:jbellsey/aurelia-cached-getter
```

It is not recommended that you use this library as a drop-in replacement for
all uses of `HttpClient.get()`. In our applications, we differentiate between
those requests which need offline caching and those that don't; in the latter case,
errors are handled normally with `catch()` clauses.

To manage the two classes of access -- cacheable and not-cachable -- we
maintain two separate client-access objects, as shown here. Use with discretion.

```javascript

import {HttpClient} from 'aurelia-http-client';
import {HttpCachedGetter} from 'jbellsey/aurelia-cached-getter';

export class MyAPImanager {

    constructor() {

        // maintain one getter for cachable queries...
        this.httpCachedGet = (new HttpCachedGetter()).configure(x => {
            x.withBaseUrl(baseURL);
        });


        // ... and another for all other queries (and verbs)
        this.http = (new HttpClient()).configure(x => {
            x.withBaseUrl(baseURL);
        });
    }
        
    // usage example
    getListOfCandidates(electionID) {
        var url = `candidates/${electionID}`;
        return this.httpCachedGet.get(url);
    }
    
    // usage example of when you might not want to use local storage for caching.
    // here we're retrieving the web page for a candidate (e.g., "http://berniesanders.com")
    getCandidateWebPage(candidatePage) {
        return this.http.get(candidatePage);
    }
}
```

# Options

Before discussing the options that are available when constructing this object, I want to show you
how we manage keys in localStorage.

Normally, the URL you pass to `get()` is used as the key. For example, in the `getListOfCandidates()`
method above, you would see a localStorage entry: `candidates/44 = "{json blob}"`. Notice that
no base URL is applied. If, however, you provided a fully-specified URL to `get()`, the complete URL
would be used as the key. 

Well, that's not precisely true. If you do nothing to override this behavior, the key is prefixed 
with "cg_", which assists in eyeballing the list of keys in localStorage. So the actual key in the 
example here would be `cg_candidates/44`.

Now we're ready to discuss the options object that you can pass to the constructor. 
Nothing here is required.

* `prefix` - You can override the prefix to be used for all localStorage keys. To remove the prefix,
    pass an empty string.

* `urlTransformer` - You can change the way keys are deployed. Instead of simply using the URL
    as the key for local storage, you can provide a function whose 
    input is the URL and whose output is the key you prefer. For instance, you could replace `/` with `-`,
    or remove redundant keywords, or simply shorten certain text strings (`candidates` => `C`). 
    Note that this transformation applies only to the key used for localStorage; the URL itself
    is not modified.

* `simulateOffline` - Also to assist with debugging, you can set this flag to `true` to 
    prevent all online access through this object.
    
    
For example:

```javascript

// remove user ID from all localStorage keys. this is not for security, but for 
// debugging convenience, simply because the key strings can get so long
function removeUserId(url) {
    return url.replace(getUserId(), '');
}

export class MyAPImanager {

    constructor() {

        this.httpCachedGet = (new HttpCachedGetter({
            urlTransformer:  removeUserId,  // see function definition above
            prefix:          '',            // suppress the default "cg_" prefix for LS keys
            simulateOffline: true           // debug how our cache is behaving
        })).configure(x => {
            x.withBaseUrl(baseURL);
        });
    }
}

```

# Wrapper for localStorage

In addition to `HttpCachedGetter`, this library provides (and uses) a thin wrapper around
localStorage. The `Storage` class ensures that all localStorage access is stringified
properly (using `JSON.stringify()`). It also manages the prefix for localStorage keys,
as described above.

You can use this to manage your own cache for other HTTP verbs. See the (trivially-short!) 
source code for more information.

# To do

* Implement a timeout for accessing the cache
* Add a way to track an Observable, intercepting both POST and GET

# Building the library

```
npm install
jspm install
gulp build
```
