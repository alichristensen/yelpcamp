var mongoose = require('mongoose'), 
	Campground = require('./models/campground'), 
	Comment = require('./models/comment'); 

var data = [
	{
		name: "Cloud's Rest", 
		image: "https://farm1.staticflickr.com/66/158583580_79e1c5f121.jpg", 
		description: "incredible views"
	}, 
	{
		name: "Desert Mesa", 
		image: "https://farm7.staticflickr.com/6135/5952249358_72202c3d82.jpg", 
		description: "beautiful colors"
	}, 
	{
		name: "Stony Hill Top", 
		image: "https://farm7.staticflickr.com/6235/6331312011_7722a2d6d8.jpg", 
		description: "spooky"
	}
];

function seedDB() {
	//remove all camps
	Campground.remove({}, function(err) {
		console.log("removed campgrounds");
		data.forEach(function(seed) {
			Campground.create(seed, function(err, camp) {
				if (err) {
					console.log(err);
				} else {
					console.log("added a campground");
					//create a comment
					Comment.create(
						{
							text: "this place is great", 
							author: "Harry Potter"
						}, function(err, comment) {
							if (err) {
								console.log(err);
							} else {
								camp.comments.push(comment);
								camp.save();
								console.log("created new comment");
							}
						});
				}
			});
		});
	});
}

module.exports = seedDB;