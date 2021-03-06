/*jshint globalstrict:true, es5:true, sub:true*/
/*globals XSS*/
'use strict';

var Util = {

    /**
     * @param {*} destination
     * @param {Object} source
     * @return {Object}
     */
    extend: function(destination, source) {
        for (var property in source) {
            if (source.hasOwnProperty(property)) {
                destination[property] = source[property];
            }
        }
        return destination;
    },

    /**
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    randomBetween: function(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    },

    /**
     * @param {Array} arr
     * @return {*}
     */
    randomItem: function(arr) {
        return arr[Util.randomBetween(0, arr.length - 1)];
    },

    /**
     * @param {string} url
     * @param {Function} callback
     */
    loadScript: function(url, callback) {
        var script, head;
        script = document.createElement('script');
        script.async = 'async';
        script.src = url;
        script.onload = callback;
        script.onerror = function() {
            var err = 'Error loading ' + url;
            XSS.shapes.err = XSS.font.shape(err, 4, XSS.PIXELS_V - 10);
        };
        head = document.querySelector('head');
        head.insertBefore(script, head.firstChild);
    },

    addListener: {
        /**
         * @param {Function} listener
         * @return {*}
         */
        keydown: function(listener) {
            return XSS.doc.addEventListener('keydown', listener, false);
        },

        /**
         * @param {Function} listener
         * @return {*}
         */
        keyup: function(listener) {
            return XSS.doc.addEventListener('keyup', listener, false);
        }
    },

    removeListener: {
        /**
         * @param {Function} listener
         * @return {*}
         */
        keydown: function(listener) {
            return XSS.doc.removeEventListener('keydown', listener, false);
        },

        /**
         * @param {Function} listener
         * @return {*}
         */
        keyup: function(listener) {
            return XSS.doc.removeEventListener('keyup', listener, false);
        }
    },

    /**
     * @param {*} obj
     * @param {*} val
     * @return {?string}
     */
    getKey: function(obj, val) {
        for (var k in obj) {
            if (obj.hasOwnProperty(k) && val === obj[k]) {
                return k;
            }
        }
        return null;
    }

};