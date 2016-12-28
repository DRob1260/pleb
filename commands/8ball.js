/**
 * Created by Will on 11/5/2016.
 */

function eightBall(msg)   {
    const responses = [
        'It is certain',
        'It is decidedly so',
        'Without a doubt',
        'Yes, definitely',
        'You may rely on it',
        'As I see it, yes',
        'Most likely',
        'Outlook good',
        'Yes',
        'Signs point to yes',
        'Reply hazy try again',
        'Ask again later',
        'Better not tell you now',
        'Cannot predict now',
        'Concentrate and ask again',
        'Don\'t count on it',
        'My reply is no',
        'My sources say no',
        'Outlook not so good',
        'Very doubtful'
    ];

    return msg.reply('🎱 ' + responses.random());
}

module.exports = {
    func: eightBall,
    triggers: '8ball',
    validator: (msg, args) => {
        return args.length > 0 && msg.content.endsWith('?');
    }

};