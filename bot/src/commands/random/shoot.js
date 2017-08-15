const resolvers = require('../../util/resolvers');
const { Argument } = require('discord-handles');

exports.exec = (cmd) => {
  const self = cmd.args.user.match(/\d+/)[0] === cmd.message.author.id;
  if (Math.random() < 0.5) cmd.response.send(`${cmd.message.author} shot ${self ? 'themselves' : cmd.args.user}!`);
  else cmd.response.send(`${cmd.message.author} tried to kill ${self ? 'themselves' : cmd.args.user} but missed. 👀`);
};

exports.middleware = function* () {
  yield new Argument('user')
    .setPrompt('Who would you like to shoot?')
    .setRePrompt('Please provide a valid user to shoot.')
    .setResolver(resolvers.user);
};
