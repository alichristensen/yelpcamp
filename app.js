var express        = require('express'), 
	app 	       = express(), 
	port 	       = 5000, 
	bodyParser     = require('body-parser'), 
	mongoose       = require('mongoose'), 
	Campground     = require('./models/campground'), 
	Comment        = require('./models/comment')
	seedDB         = require('./seeds'), 
	passport       = require('passport'),
	User           = require('./models/user')
	LocalStrategy  = require('passport-local'), 
	methodOverride = require('method-override');

var campgroundRoutes = require('./routes/campgrounds'), 
	commentRoutes    = require('./routes/comments'), 
	indexRoutes      = require('./routes/index');

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost/yelp_camp');
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//seedDB(); //seed the DB

//PASSPORT CONFIG
app.use(require('express-session')({
	secret: "again pearl is the bomb dot com", 
	resave: false, 
	saveUninitialized: false
})); 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.current = req.user;
	next();
});

app.use(indexRoutes); 
app.use("/campgrounds/:id/comments", commentRoutes); 
app.use("/campgrounds", campgroundRoutes);

app.listen(port, function(){
	console.log("listening at " + port);
});