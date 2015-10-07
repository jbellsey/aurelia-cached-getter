import {HttpClient} from 'aurelia-http-client';

// wrapper around localStorage.
// used by our caching system, but also freely available
// for other consumers
//

export class Storage {

    constructor(prefix) {
        this.prefix = prefix || '';
    }

    set(key, value) {
        localStorage[this.prefix + key] = JSON.stringify(value);
    }
    get(key) {
        try {
            return JSON.parse(localStorage[this.prefix + key]);
        }
        catch(e) {
            // TODO: better error
            console.log('localstorage not found (or not parsed properly) for key =', this.prefix + key);
            return undefined;
        }
    }
}


export {Storage};

export class HttpCachedGetter extends HttpClient {

    /**
     * Create a new Cached Getter.
     *
     * @param {function} [urlTransformer]  - optional. function takes a URL (string), and can transform it. if omitted,
     *                                       the URL is used as the key for the entry in localStorage.
     * @param {string}   [prefix]          - optional. if provided, all keys in localStorage will be prefixed
     * @param {boolean}  [simulateOffline] - if this flag is true, no actual GET operations will occur
     */
    constructor({urlTransformer, prefix, simulateOffline}) {

        super();
        this.urlTransformer  = urlTransformer || (url => url);
        this.storage         = new Storage(typeof prefix === 'string' ? prefix : 'cg_');
        this.simulateOffline = !!simulateOffline;
    }

    get(url) {
        var stor = this.storage,
            transformedURL = this.urlTransformer(url);

        if (this.simulateOffline || !navigator.onLine) {
            return new Promise(resolve => resolve(stor.get(transformedURL)));
        }
        else {
            return super.get(url).then(data => {
                stor.set(transformedURL, data);
                return data;
            });
        }
    }
}