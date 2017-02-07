var express = require('express'), 
	router  = express.Router(), 
	Campground = require('../models/campground');

router.get("/", function(req, res) {
	console.log(req.user);
	Campground.find({}, function(err, camps) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: camps});
		}
	})
}); 

router.post("/", isLoggedIn, function(req, res) {
	//create new campground and save to DB
	var author = {
		id: req.user._id, 
		username: req.user.username
	};
	Campground.create({
		name: req.body.name,
		image: req.body.image, 
		description: req.body.description, 
		author: author
	}, function(err, newCamp) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});

router.get("/new", isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

//shows more info about one campground
router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCamp);
			res.render("campgrounds/show", {camp: foundCamp});
		}
	});
});

//EDIT route
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, found){
		res.render("campgrounds/edit", {camp: found});
	});
});

//UPDATE route
router.put("/:id", checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + updatedCamp._id);
		}
	});
}); 

//DESTROY route
router.delete("/:id", checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, found){
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