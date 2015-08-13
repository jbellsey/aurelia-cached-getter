System.register([], function (_export) {
    'use strict';

    var Storage;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [],
        execute: function () {
            Storage = (function () {
                function Storage(prefix) {
                    _classCallCheck(this, Storage);

                    this.prefix = prefix || '';
                }

                Storage.prototype.set = function set(key, value) {
                    localStorage[this.prefix + key] = JSON.stringify(value);
                };

                Storage.prototype.get = function get(key) {
                    try {
                        return JSON.parse(localStorage[this.prefix + key]);
                    } catch (e) {
                        console.log('localstorage not found (or not parsed properly) for key =', this.prefix + key);
                        return undefined;
                    }
                };

                return Storage;
            })();

            _export('Storage', Storage);
        }
    };
});