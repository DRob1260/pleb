require('./util/extensions');
require('./util/extensions/Playlist');
require('./util/extensions/Validator');
require('moment-duration-format');

const axios = require('axios');
const discord = require('discord.js');
const Constants = require('discord.js/src/util/Constants');
const Raven = require('raven');

const Logger = require('./core/Logger');
const Handler = require('./core/commands/Handler');
const Provider = require('./core/Provider');

module.exports = new class extends discord.Client {
  constructor() {
    super({
      messageCacheLifetime: 1800,
      messageSweepInterval: 900,
      disabledEvents: [Constants.Events.TYPING_START]
    });

    Object.defineProperty(this, 'bot', { value: this });

    this.log = new Logger(this);
    this.db = new Provider(this);
    this.handler = new Handler(this);

    this.log.verbose('instantiated client');

    if (process.env.raven) {
      Raven.config(process.env.raven, {
        captureUnhandledRejections: true
      }).install();
      this.log.verbose('loaded raven');
    } else {
      process.on('unhandledRejection', this.log.error);
    }

    this.once('ready', this.onInit.bind(this));
    this.on('reconnecting', this.onReconnecting.bind(this));
    this.on('resume', this.onResume.bind(this));
    this.on('disconnect', this.onDisconnect.bind(this));
    this.on('error', e => Raven.captureException(e));

    this.on('guildCreate', this.onGuildCreate.bind(this));
    this.on('guildDelete', this.onGuildDelete.bind(this));

    this.log.verbose('instantiated event listeners');
    this.login(process.env.discord);
  }

  async onInit() {
    this.log.info('client is ready: %s#%s', this.user.username, this.user.discriminator);
    await this.db.initialize();

    this.log.hook({
      title: 'Initialized',
      color: 0x00ff93
    });

    this.log.verbose('initialized database');
    await this.db.guilds.sync();
    await this.updateStats();
    this.log.verbose('synchronized stats');
  }

  onReconnecting() {
    this.log.hook({
      title: 'Reconnecting',
      color: 0xf4f141
    });
  }

  onResume(replayed) {
    for (const guild of this.guilds.values()) guild.playlist.stop('continue');

    this.log.hook({
      title: 'Resumed',
      description: `Replayed **${replayed}** events.`,
      color: 0x9bffd5
    });
  }

  onDisconnect(close) {
    for (const guild of this.guilds.values()) guild.playlist.stop();

    this.log.hook({
      title: 'Disconnected',
      description: `Code: ${close.code}`,
      color: 0xff5e5e
    });
  }

  onGuildCreate(guild) {
    const channel = this.client.channels.find(c => {
      const perms = c.permissionsFor(guild.me);
      return c.type === 'text' && perms && perms.has(discord.Permissions.FLAGS.SEND_MESSAGES);
    });

    if (channel) channel.send('Sup.  Try `@Pleb help`.');
    this.db.guilds.insert(guild);
  }

  onGuildDelete(guild) {
    const playlist = this.guilds.playlist;
    if (playlist) playlist.destroy();
    this.db.guilds.delete(guild);
  }

  async updateStats() {
    if (process.env.discord_pw) {
      await axios.post(`https://bots.discord.pw/api/bots/${this.user.id}/stats`, {
        shard_id: this.shard.id,
        shard_count: this.shard.count,
        server_count: this.guilds.size
      }, {
        headers: { Authorization: process.env.discord_pw }
      });
    }
  }
};
