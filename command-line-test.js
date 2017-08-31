const index = require('./');

new index({
	shouldSplit: true
}).then((data) => {
	console.log('we are done!!!\n\n', data);
});
