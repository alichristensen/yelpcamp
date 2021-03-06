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

router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, found){
		if (err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {camp_id: req.params.id, comment: found});
		}
	});
});

router.put("/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated){
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Destroy route
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, found){
			if (err) {
				res.redirect("back");
			} else {
				//does user own the campground? 
				if(found.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}

module.exports = router;