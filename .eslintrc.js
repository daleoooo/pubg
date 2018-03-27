module.exports = {
	"env": {
		"mocha": true
	},
	root: true,
	extends: 'airbnb-base',
	parserOptions: {
		'sourceType': 'module'
	},
	'rules': {
		'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
		'no-alert': process.env.NODE_ENV === 'production' ? 2 : 1
	}
}
