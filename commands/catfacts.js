/**
 * Created by Will on 10/9/2016.
 */

const shuffle = require('knuth-shuffle').knuthShuffle,
    fs = require('fs');
    readline = require('readline');

function Catfacts(client, msg, args)    {
    let arr = [];
    readline.createInterface({
        input: fs.createReadStream('assets/data/catfacts.txt')
    }).on('line', line => {
        arr.push(line);
    }).on('close', () => {
        arr = shuffle(arr);
        msg.channel.sendMessage(arr[0]);
    });
}

module.exports = Catfacts;