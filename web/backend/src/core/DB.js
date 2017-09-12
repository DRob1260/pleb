const rethinkdb = require('rethinkdbdash');

const Info = require('../data/Info');
const Users = require('../data/Users');
const Guilds = require('../data/Guilds');
const Playlists = require('../data/Playlists');

class RethinkProvider {
  constructor(server) {
    this.server = server;
    this.r = rethinkdb({ servers: [{ host: process.env.rethink }], db: 'pleb' });

    this.users = new Users(this);
    this.guilds = new Guilds(this);
    this.playlists = new Playlists(this);

    this.info = new Info(this);
  }
}

module.exports = RethinkProvider;
