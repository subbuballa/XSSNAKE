/*jshint globalstrict:true*/
'use strict';

var Client = require('./client.js');

/**
 * @constructor
 */
function State() {
    /* @typedef {number} */
    this.num = 0;
    /* @typedef {Object.<number, {Client}>} */
    this.clients = {};
}

State.prototype = {

    /**
     * @param {EventEmitter} socket
     * @return {Client}
     */
    addClient: function(socket) {
        var id = ++this.num;
        this.clients[id] = new Client(id, socket);
        return this.clients[id];
    },

    /**
     * @param {Client} client
     */
    removeClient: function(client) {
        delete this.clients[client.id];
    }

};

module.exports = State;