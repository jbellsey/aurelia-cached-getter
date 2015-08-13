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
