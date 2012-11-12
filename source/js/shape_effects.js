/*jshint globalstrict:true, es5:true, sub:true*/
/*globals XSS, Shape, Utils*/

'use strict';

Shape.prototype._effects = {

    /**
     * @param {number} speed
     * @return {function({number})}
     */
    flash: function(speed) {
        var progress = 0;
        speed = speed || XSS.FLASH_NORMAL;
        return function(delta) {
            progress += delta;
            if (progress > speed) {
                progress -= speed;
                this.enabled = !this.enabled;
            }
        };
    },

    /**
     * @param {number} start
     * @param {number} stop
     * @param {boolean=} deleteShape
     * @return {function({number})}
     */
    lifetime: function(start, stop, deleteShape) {
        var key, progress = 0;
        return function(delta) {
            // Enable/disable shape only once, allows combination
            // with other enabling/disabling effects

            // Init
            progress += delta;
            if (progress === delta) {
                this.enabled = false;
            }

            // Stop time reached
            if (stop && progress >= stop) {
                if (deleteShape) {
                    key = Utils.getKey(XSS.shapes, this);
                    if (key) { delete XSS.shapes[key]; }
                    key = Utils.getKey(XSS.overlays, this);
                    if (key) { delete XSS.overlays[key]; }
                } else {
                    delete this.effects.lifetime;
                    this.enabled = false;
                }
            }

            // Start time reached
            else if (progress >= start) {
                start = stop;
                this.enabled = true;
            }
        };
    },

    /**
     * @param {Object=} options
     * @return {function({number})}
     */
    swipe: function(options) {
        var from, duration, to, x, y, clone, dynamic, progress = 0;

        options  = options || {};
        from    = options.from || [0, 0];
        to      = options.to || [0, 0];
        duration = options.duration || 200;
        clone    = this.clone();
        dynamic  = this.dynamic;

        this.dynamic = true;

        return function(delta) {
            progress += delta;
            if (progress < duration) {
                x = from[0] - ((from[0] - to[0]) * progress / duration);
                x = Math.round(x);
                y = from[1] - ((from[1] - to[1]) * progress / duration);
                y = Math.round(y);
                this.pixels = XSS.transform.shift(clone.pixels, x, y);
            } else {
                delete this.effects.swipe;
                this.pixels = XSS.transform.shift(clone.pixels, to[0], to[1]);
                this.dynamic = dynamic;
                if (options.callback) {
                    options.callback();
                }
            }
        };
    }

};