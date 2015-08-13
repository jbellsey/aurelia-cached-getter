define(['exports'], function (exports) {
    'use strict';

    exports.__esModule = true;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var Storage = (function () {
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

    exports.Storage = Storage;
});