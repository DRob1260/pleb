const Validator = require('../../core/Validator');
const { Argument } = require('discord-handles');

const allowedSettings = new Set([
  'prefix'
]);

exports.exec = async (cmd) => {
  let settings = cmd.client.bot.guildSettings.get(cmd.guild.id);
  if (!settings) settings = await cmd.client.bot.provider.initializeGuild(cmd.guild);
  await settings.set(cmd.args.key, cmd.args.value);
  return cmd.response.success(`**${cmd.args.key}** set to \`${cmd.args.value}\``);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureGuild();
  const settings = Array.from(allowedSettings.values()).join(', ');
  const key = yield new Argument('key')
    .setPrompt(`What setting would you like to modify? \`${settings}\``)
    .setRePrompt(`That setting wasn't valid.  Please try again.  \`${settings}\``)
    .setResolver(c => allowedSettings.has(c.toLowerCase()) ? c.toLowerCase() : null);

  yield new Argument('value')
    .setPrompt(`What would you like to set ${key} to?`)
    .setPattern(/.*/);
};
