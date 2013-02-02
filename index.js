// Create the configuration
var config = {
	channels: ["#laravel"],
	server: "irc.freenode.net",
	botName: "rBot",
	insults: {
		host: "www.insult-o-matic.com",
		yoMama: "/insults/?yourname={{name}}&numinsults=1&mode=yomama"
 	}
};

// Get the libs
var irc = require('irc');
var http = require('http');

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

// Listen to people joining the channel
bot.addListener('message#', function(from, to, text, message) {
	var matches
	if (matches = text.match(/^insult (.+)$/)) {
		var name = matches[1];

		// Don't insult itself
		if (strtolower(name) === strtolower(config.botName)) {
			name = from;
		}
		var reqConfig = {
			host: config.insults.host,
			path: (config.insults.yoMama).replace('{{name}}', name)
		}


		console.log('Insulting ' + name);

		http.request(reqConfig, function(response) {
			var str = '';

			response.on('data', function(chunk) {
				str += chunk;
			});

			response.on('end', function() {
				bot.say(to, yoMama(str, name));
			});
		}).end();
	}
});

yoMama = function(response, name) {
	return 'Hey ' + name + '! ' + parseInsult(response);
}

parseInsult = function(html) {
	var response = html.match(/font color=#000000 .+?\n{2}(.+?)\n/)[1];
	response = response.replace(/<.+?>(.+?)<.+?>/, '$1');
	while (response.match(/\s{2,}/)) {
		response = response.replace(/\s{2,}/, ' ');
	}
	return response;
}