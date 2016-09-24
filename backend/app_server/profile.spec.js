/*
 * Test suite for profile.js
 */
var request = require('request')
var post = require('./profile.js')

function url(path) {
	return "http://localhost:3000" + path
	//return "http://webdev-dummy.herokuapp.com"+path
}

describe('Validate profile Functionality', function() {
	var num;

	it('should get the status', function(done) {
		
		request({url: url("/status"), method: 'GET'}, function(err, res, body){
			
			var statusContent=JSON.parse(body)		
			expect(statusContent.statuses[0].status).toBe("This is the status");
			done()
		})
 	}, 500)//the amount of time the test wait for


	it('should update the status', function(done) {
		
		request({url: url("/status"), method: 'PUT', 
			json: {
    			username:'lz44',
    			status:"This is the new status"
    		}}, function(err, res, body){
			
			expect(body.statuses[0].status).toBe("This is the new status")
			done()
		})

 	}, 200)

});

