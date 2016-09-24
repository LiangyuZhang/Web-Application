function Reply(person, timestamp, content) {
	this.person = person;
	this.timestamp = timestamp;
	this.content = content;
	this.id = "";
}


function Post(person, timestamp, content) {
	this.person = person;
	this.timestamp = timestamp;
	this.content = content;
	this.replies = [];
	this.imageurl = "";
	this.id = "";
}

Post.prototype.addReply = function(reply) {
	var length = this.replies.length;
	this.replies[length] = reply;
};

function Person(name, avatar, status) {
	this.name = name;
	this.avatar = avatar;
	this.status = status;
}

