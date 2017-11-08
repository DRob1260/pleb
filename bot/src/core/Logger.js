const winston = require('winston');
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = class Logger extends winston.Logger {
  constructor(client) {
    super({
      transports: [
        new (winston.transports.File)({ filename: 'pleb.log' }),
        new (winston.transports.Console)(),
      ],
      level: process.env.log_level || 'verbose'
    });

    this.client = client;
    this.webhook = new WebhookClient(process.env.webhook_id, process.env.webhook_token);
  }

  hook(data = {}) {
    const embed = new MessageEmbed(data)
      .setFooter(`Shard ${this.client.shard.id}`)
      .setTimestamp();

    if (process.env.webhook_id && process.env.webhook_token) return this.webhook.send({ embed });
    return Promise.resolve();
  }
};
