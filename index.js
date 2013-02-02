// Get the libs
irc = require('irc');
http = require('http');

// Setup basic http callback; fuck yea, double closure
httpClosureCallback = function(realCallback) {
	return function(response) {
		var str = '';

		response.on('data', function(chunk) {
			str += chunk;
		});

		response.on('end', function () {
			return realCallback(str);
		});
	}
}

// Require auxiliar files
require('./config.js');
require('./commands.js');

// Create the bot
bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

// Listen to commands
bot.addListener('message#', function(from, to, text, message) {
	var e = {
		from: from,
		to: to,
		text: text,
		message: message
	};

	for (c in commands) {
		command = commands[c];
		var matches;
		if (matches = text.match(command.pattern)) {
			console.log(matches[0]);
			matches[0] = e;
			console.log(matches[1]);
			return command.handler.apply(command, matches);
		}
	}
});