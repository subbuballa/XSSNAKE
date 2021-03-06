/*jshint globalstrict:true, es5:true, node:true*/
'use strict';

var events = require('../shared/events.js');

/**
 * @param {Object} server
 * @param {Client} client
 * @param {Object} socket
 * @constructor
 */
function EventHandler(server, client, socket) {
    this.server = server;
    this.client = client;
    this.socket = socket;

    client.emit(events.CLIENT_CONNECT, client.id);

    socket.on('disconnect', this._disconnect.bind(this));
    socket.on(events.SERVER_ROOM_MATCH, this._matchRoom.bind(this));
    socket.on(events.SERVER_CHAT_MESSAGE, this._chat.bind(this));
    socket.on(events.SERVER_SNAKE_UPDATE, this._snakeUpdate.bind(this));
    socket.on(events.SERVER_GAME_STATE, this._gameState.bind(this));
}

module.exports = EventHandler;

EventHandler.prototype = {

    /**
     * @private
     */
    _disconnect: function() {
        var room, client = this.client;
        room = this.server.roomManager.rooms[client.roomid];
        if (room) {
            room.leave(client);
            // Room takes care of removing client data. It needs client data
            // to finish the round gracefully.
        } else {
            this.server.state.removeClient(client);
        }
    },

    /**
     * @param {Object} data Object with keys name, pub, friendly
     * @private
     */
    _matchRoom: function(data) {
        var room, client = this.client, server = this.server;
        client.name = data.name;
        room = server.roomManager.getPreferredRoom(data);
        room.join(client);
    },

    /**
     * @param {string} message
     * @private
     */
    _chat: function(message) {
        var room, data;
        room = this._clientRoom(this.client);
        if (room) {
            data = [room.clients.indexOf(this.client), message.substr(0, 30)];
            room.broadcast(events.CLIENT_CHAT_MESSAGE, data, this.client);
        }
    },

    /**
     * @param data [<Array>,<number>] 0: parts, 1: direction
     */
    _snakeUpdate: function(data) {
        var game = this._clientGame(this.client);
        if (game && game.room.inProgress) {
            game.updateSnake(this.client, data[0], data[1]);
        }
    },

    /**
     * @private
     */
    _gameState: function() {
        var game = this._clientGame(this.client);
        if (game && game.room.inProgress) {
            game.emitState(this.client);
        }
    },

    /**
     * @param {Client} client
     * @return {Room}
     * @private
     */
    _clientRoom: function(client) {
        return this.server.roomManager.room(client.roomid);
    },

    /**
     * @param {Client} client
     * @return {Game}
     * @private
     */
    _clientGame: function(client) {
        return (client.roomid) ? this._clientRoom(client).game : null;
    }

};