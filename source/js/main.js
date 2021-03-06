/*jshint globalstrict:true, es5:true, sub:true*/
/*globals Util, PublishSubscribe, Canvas, ShapeGenerator, Transform, Font, StageFlow, Socket */
'use strict';

// Dummy container for Requirejs client-server shared objects
var module = {};

var XSS = {};

window.onerror = function() {
    XSS.error = true; // Stops draw loop
};

XSS.main = function() {

    /** @type {Object.<string,Shape>} */
    XSS.shapes    = {};

    /** @type {Object.<string,Shape>} */
    XSS.overlays  = {};

    // DOM
    XSS.doc       = document.body;

    // Shortcuts
    XSS.on        = Util.addListener;
    XSS.off       = Util.removeListener;

    // Singletons
    XSS.pubsub    = new PublishSubscribe();
    XSS.canvas    = new Canvas();
    XSS.shapegen  = new ShapeGenerator();
    XSS.transform = new Transform();
    XSS.font      = new Font();
    XSS.stageflow = new StageFlow();
    XSS.socket    = new Socket(function() {
        var data = {
            'name'    : decodeURIComponent(location.search).substring(1) ||
                        localStorage && localStorage.getItem('name') ||
                        'Anon',
            'friendly': true,
            'pub'     : true
        };
        XSS.socket.emit(XSS.events.SERVER_ROOM_MATCH, data);
    });

};

// Give Webkit time to initialize @font-face
window.onload = function() {
    setTimeout(XSS.main, 200);
};