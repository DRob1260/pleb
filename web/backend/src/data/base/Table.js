const EventEmitter = require('events');
const constants = require('../../util/constants');

class Table extends EventEmitter {
  static get actions() {
    return [
      'add',
      'remove',
      'change',
      'initial',
      'uninitial',
      'state',
    ];
  }

  constructor(db, name) {
    super();
    this.db = db;
    this.name = name;
  }

  async watch(connection, filter = {}) {
    const cursor = await this.table.filter(filter).changes({ includeTypes: true, includeInitial: true }).run();
    cursor.each((err, data) => {
      if (err) throw err;
      connection.send(constants.op.DATA, { new: data.new_val, old: data.old_val }, { t: this.name, a: data.type });
    });
    return cursor;
  }

  get r() {
    return this.db.r;
  }

  get table() {
    return this.r.table(this.name);
  }

  get(id) {
    return this.table.get(id).run();
  }
}

module.exports = Table;
