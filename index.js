/**
 * Created by Will on 8/25/2016.
 */
require('dotenv').config({
    silent: true
});
const Discord = require('discord.js');

if(process.env.raven)   {
    const raven = require('raven');
    var ravenClient = new raven.Client(process.env.raven);
    ravenClient.patchGlobal();
}

var client = new Discord.Client();

// Define commands
const commands = {
    add: require('./commands/add'),
    play: require('./commands/play'),
    stfu: require('./commands/stfu'),
    shuffle: require('./commands/shuffle'),
    pause: require('./commands/pause'),
    resume: require('./commands/resume'),
    next: require('./commands/next'),
    ping: require('./commands/ping'),
    imgur: require('./commands/imgur'),
    help: require('./commands/help'),
    boobs: require('./commands/boobs'),
    memes: require('./commands/memes'),
    stats: require('./commands/stats'),
    dick: require('./commands/dick'),
    id: require('./commands/id'),
    born: require('./commands/born'),
    search: require('./commands/search'),
    insult: require('./commands/insult'),
    catfacts: require('./commands/catfacts')
};

client.on('ready', function()   {
    console.log('Bot is ready.');
});

client.on('guildCreate', function(guild) {
    console.log("count#event.guildCreate=1");
    guild.defaultChannel.sendMessage('Sup.  Try `@Pleb help`.');
});

client.on('message', function (message) {
    console.log("count#event.message=1");

    const parts = parseCommand(message);

    if(parts)   {
        const command = parts[0];
        const args = parts.slice(1);

        if(typeof commands[command] === 'function') {
            message.channel.startTyping();
            console.log("count#command." + command + "=1");

            commands[command](client, message, args).then(res => {
                if(res && typeof res == 'string')   {
                    message.channel.sendMessage(res);
                }
                message.channel.stopTyping();
            }).catch(err => {
                console.error(err);
                message.reply(err);
                message.channel.stopTyping();
            });
        }   else    {
            if(message.channel.name !== 'pleb') {
                message.reply('you didn\'t want to do that anyway. :stuck_out_tongue_closed_eyes:');
            }
        }
    }
});

client.login(process.env.discord).then(function()   {
    console.log('Logged in.');
}).catch(function(err)   {
    console.error(err);
});

/**
 * Parse an incoming message as a command.
 * @param {Message} msg
 */
function parseCommand(msg)  {
    if(msg.author.id === client.user.id)    {
        return false;
    }

    const parts = msg.content.split(' ');
    const mentionedFirst = (parts[0] === '<@' + process.env.discord_client_id + '>') || (parts[0] === '<@!' + process.env.discord_client_id + '>');

    if(msg.channel.name === 'pleb' || msg.channel.guild == null) {
        if(mentionedFirst)    {
            return parts.slice(1);
        }   else    {
            return parts;
        }
    }   else    {
        if(!mentionedFirst)    {
            return false;
        }

        return parts.slice(1);
    }
}