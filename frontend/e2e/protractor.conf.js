exports.config = {
	allScriptsTimeout: 11000,
	specs: ['scenarios.js'],
	capabilities: {
		'browserName': 'chrome',
		'chromeOptions': {
			'args': ['incognito', 'disable-extensions']
		}
	},

	directConnect: true,
	baseUrl: 'http://localhost:8080/',
	//dummy server
	framework: 'jasmine2',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	},

	onPrepare: function() {
		browser.driver.manage().window().setPosition(0, 0);
		browser.driver.manage().window().setSize(2000, 1800);
		browser.driver.manage().window().maximize();
		var jr = require('jasmine-reporters')
		jasmine.getEnv().addReporter(new jr.JUnitXmlReporter({
			savePath: 'e2e-results'
		}))
		jasmine.getEnv().addReporter(new jr.TapReporter())
	}
}