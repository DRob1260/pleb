/**
 * Created by Will on 8/25/2016.
 */

const storage = require('../storage/playlists');

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {string|undefined}
 */
exports.func = (msg, args) => {
    const playlist = storage.get(msg.guild.id);
    if(playlist)    {
        playlist.continue = false;
        playlist._dispatcher.end();
        storage.delete(msg.guild.id);
    }
    msg.guild.voiceConnection.disconnect();
    return 'k 😢';
};

exports.triggers = [
    'stfu',
    'stop',
    'leave'
];

exports.validator = msg => !!(msg.guild && msg.guild.voiceConnection);
