const EventEmitter = require('events');
const jwt = require('jsonwebtoken');
const User = require('../structures/User');
const constants = require('../util/constants');

class Connection extends EventEmitter {
  constructor(socket, id, connection, request) {
    super();
    this.socket = socket;
    this.id = id;
    this.connection = connection;
    this.request = request;

    this.connection.on('message', m => this.emit('message', JSON.parse(m)));
    this.ready();
  }

  async ready() {
    await this.send(constants.op.READY, {
      id: this.id,
      info: await this.socket.server.db.getInfo()
    });

    const cookies = {};
    this.request.headers.cookie.split('; ').map(pair => pair.split('=')).forEach(cookie => cookies[cookie[0]] = cookie[1]);
    if (cookies.token) await this.identify(cookies.token);
  }

  async identify(token) {
    const decoded = jwt.decode(token);
    if (!decoded) return;

    const user = await this.socket.server.db.getUser(decoded.userID);
    if (!user) return;

    this.user = new User(this.socket.server, token, user);
    return this.send(constants.op.IDENTIFY, { token, user });
  }

  send(op, data) {
    return this.connection.send(JSON.stringify({ op, d: data }));
  }
}

module.exports = Connection;
