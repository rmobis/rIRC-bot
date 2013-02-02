commands = [
	{
		pattern: /^!insult ([\S]+)\s?(classic|evilfortune|pirate|psychiatric|redneck|shakespeare|simple|yomama)?$/i,
		handler: function(e, name, mode) {
			mode = mode || 'classic';

			if ([config.botName.toLowerCase(), config.ownerName.toLowerCase()].indexOf(name.toLowerCase()) !== -1) {
				name = e.from;
			}

			http.get(this.URL(name, mode), httpClosureCallback(function(str) {
				// Get only the part we want
				var insult = str.match(/font color=#000000 .+?\n{2}(.+?)\n/)[1];

				// Remove HTML tags
				insult = insult.replace(/<.+?>(.+?)<.+?>/, '$1');

				// Remove double/triple whitespaces
				while (insult.match(/\s{2,}/)) {
					insult = insult.replace(/\s{2,}/, ' ');
				}

				console.log('Insulting ' + name);
				bot.say(e.to, 'Hey ' + name + '! ' + insult);
			}));
		},
		URL: function(name, mode) {
			return {
				host: "www.insult-o-matic.com",
				path: "/insults/?yourname=" + name + "&numinsults=1&mode=" + mode
			};
		}
	}
];