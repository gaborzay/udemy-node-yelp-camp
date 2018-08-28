var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");
    
// List all campgrounds
router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
       if (err) {
           console.log(err);
       } else {
           res.render("campgrounds/index", {campgrounds: campgrounds});
       }
    });
});

// Show new campground form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// Create a new campground
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to campgrounds array
    // redirect back to campgrounds page
    var name = req.body.name,
        image = req.body.image,
        price = req.body.price,
        description = req.body.description,
        newCampground = {
            name: name, 
            image: image,
            price: price,
            description: description,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        };
    
    Campground.create(newCampground, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

// Show a campground
router.get("/:id", function(req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground}); 
        }
    });
});

// Show edit form for a campground
router.get("/:id/edit", middleware.checkCampgroundOwnerShip, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// Update a campground
router.put("/:id", middleware.checkCampgroundOwnerShip, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy a campground
router.delete("/:id", middleware.checkCampgroundOwnerShip, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;