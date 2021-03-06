const moment = require('moment');
const { Command } = require('discord-handles');

module.exports = class extends Command {
  static get triggers() {
    return ['stats', 'status'];
  }

  async exec() {
    const client = this.client;

    const stats = {
      servers: await client.shard.broadcastEval('this.guilds.size'),
      channels: await client.shard.broadcastEval('this.channels.size'),
      users: await client.shard.broadcastEval('this.guilds.reduce((p, c) => p + c.memberCount, 0)'),
      memory: await client.shard.broadcastEval('process.memoryUsage().heapUsed')
    };

    for (const s in stats) stats[s] = stats[s].reduce((a, b) => a + b);

    return this.response.send(`**Servers:** ${stats.servers}
**Channels:** ${stats.channels}
**Users:** ${stats.users}
**Playlists:** ${client.lavaqueue.stats ? parseInt(client.lavaqueue.stats.playingPlayers) : 0}

__**Shard info:**__
**Shard:** ${client.shard.id + 1} / ${client.shard.count}
**Servers:** ${client.guilds.size}
**Channels:** ${client.channels.size}
**Users:** ${client.users.size}

__**Process info:**__
**Memory:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
**Total memory:** ${(stats.memory / 1024 / 1024).toFixed(2)} MB
**Uptime:** ${moment.duration(process.uptime(), 's').format('d [days] h [hrs] mm [mins] ss [secs]')}`);
  }
};
