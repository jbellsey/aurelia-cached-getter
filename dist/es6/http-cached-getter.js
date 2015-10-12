
import {HttpClient} from 'aurelia-http-client';
import {Storage} from './storage';

export {Storage};

export class HttpCachedGetter extends HttpClient {

    /**
     * Create a new Cached Getter.
     *
     * @param {object}   [options]                 - details below:
     * @param {function} [options.urlTransformer]  - optional. function takes a URL (string), and can transform it.
     *                                               if omitted, the URL is used as the key for the entry in
     *                                               localStorage.
     * @param {string}   [options.prefix]          - optional. if provided, all keys in localStorage will be prefixed
     * @param {boolean}  [options.simulateOffline] - if this flag is true, no actual GET operations will occur
     */
    constructor(options) {

        var {
                urlTransformer,
                prefix,
                simulateOffline
            } = options || {};

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