/**
 * Created by Will on 12/17/2016.
 */

module.exports = {
    nsfwAllowed: message => {
        return !!(message.channel.type === 'dm' || message.member.roles.find('name', 'nsfw') || message.channel.name === 'nsfw');
    }
};