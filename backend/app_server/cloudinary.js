////////////////////////////////
// Upload files to Cloudinary //
////////////////////////////////
var multer = require('multer')
var stream = require('stream')
var cloudinary = require('cloudinary')

// cloudinary.config({ 
//   cloud_name: 'hxmi21emw', 
//   api_key: '855422442348955', 
//   api_secret: 'nUN2MJ-rzobXsxIniR3qSfXRKGk' 
// });

exports.putImage = putImage

function putImage(req, res, callback) {
	// body-parser provides us the textual formData
	// which is just title in this case
	var publicName = req.body.title

	var uploadStream = cloudinary.uploader.upload_stream(function(result) {    	
		// create an image tag from the cloudinary upload
		var image = cloudinary.image(result.public_id, {
			format: "png", width: 100, height: 130, crop: "fill" 
		})
		// create a response to the user's upload

		callback(req, res, result)

	}, { public_id: publicName })	

	// multer can save the file locally if we want
	// this is done in upload.js (see final assignment page)
	// Instead we do not instruct multer to save the file
	// and instead have the file in memory.
	// multer provides req.file and within is the byte buffer

	// we create a passthrough stream to pipe the buffer
	// to the uploadStream for cloudinary.
	var s = new stream.PassThrough()
	s.end(req.file.buffer)
	s.pipe(uploadStream)
	s.on('end', uploadStream.end)
	// and the end of the buffer we tell cloudinary to end the upload.

}
