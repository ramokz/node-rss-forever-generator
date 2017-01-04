var forever         = require('forever-monitor');


 var child = new (forever.Monitor)('main.js', {
    silent: false,
    args: []
});

	child.start();