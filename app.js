const express           = require("express"),
      bodyParser        = require("body-parser"),
      expressSanitizer  = require("express-sanitizer"),
      mongoose          = require('mongoose'),
      passport          = require("passport"),
      LocalStrategy     = require("passport-local"),
      methodOverride    = require("method-override"),
      flash             = require("connect-flash"),
      User              = require("./models/user"),
      seedDB            = require("./seeds"),
      app               = express(),
      PORT              = process.env.PORT || 3000;
    
const commentRoutes     = require("./routes/comments"),
      campgroundRoutes  = require("./routes/campgrounds"),
      indexRoutes       = require("./routes/index");

const url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "My big little secret",
    resave: false,
    saveUninitialized:  false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    return next();
});

// REQUIRING ROUTES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(PORT, process.env.IP, function() {
   console.log("Yelp Camp server has started."); 
});