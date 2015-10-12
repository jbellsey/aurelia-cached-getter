'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _aureliaHttpClient = require('aurelia-http-client');

var _storage = require('./storage');

exports.Storage = _storage.Storage;

var HttpCachedGetter = (function (_HttpClient) {
    _inherits(HttpCachedGetter, _HttpClient);

    function HttpCachedGetter(options) {
        _classCallCheck(this, HttpCachedGetter);

        var _ref = options || {};

        var urlTransformer = _ref.urlTransformer;
        var prefix = _ref.prefix;
        var simulateOffline = _ref.simulateOffline;

        _HttpClient.call(this);
        this.urlTransformer = urlTransformer || function (url) {
            return url;
        };
        this.storage = new _storage.Storage(typeof prefix === 'string' ? prefix : 'cg_');
        this.simulateOffline = !!simulateOffline;
    }

    HttpCachedGetter.prototype.get = function get(url) {
        var stor = this.storage,
            transformedURL = this.urlTransformer(url);

        if (this.simulateOffline || !navigator.onLine) {
            return new Promise(function (resolve) {
                return resolve(stor.get(transformedURL));
            });
        } else {
            return _HttpClient.prototype.get.call(this, url).then(function (data) {
                stor.set(transformedURL, data);
                return data;
            });
        }
    };

    return HttpCachedGetter;
})(_aureliaHttpClient.HttpClient);

exports.HttpCachedGetter = HttpCachedGetter;