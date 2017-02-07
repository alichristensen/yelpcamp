var express = require('express'), 
	router  = express.Router({mergeParams: true}), 
	Campground = require('../models/campground'), 
	Comment = require('../models/comment');

//=======================COMMENTS ROUTES==========================
router.get("/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, camp){
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {camp: camp});
		}
	});
});

router.post("/", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, camp){
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					console.log(err);
				} else {
					//add username and id to comment and save
					comment.author.id = req.user._id; 
					comment.author.username = req.user.username;
					comment.save();
					camp.comments.push(comment);
					camp.save();
					console.log(comment);
					res.redirect('/campgrounds/' + camp._id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit", function(req, res){
	res.render("comments/edit");
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;