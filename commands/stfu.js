/**
 * Created by Will on 8/25/2016.
 *
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 */
function Stfu(client, msg, args)    {
    const playlist = msg.guild.playlist;
    if(playlist)  {
        playlist.destroy();
        delete msg.guild.playlist;
        return Promise.resolve();
    }   else    {
        return msg.reply('when someone asks you to do something and you\'ve already done it. :joy:');
    }
}

module.exports = Stfu;