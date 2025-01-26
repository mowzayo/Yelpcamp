const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/Campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
   req.flash ('error', 'You must be logged in to view this page.');
   return res.redirect('/login');
}
next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.originalUrl !== '/login' && req.originalUrl !== '/register') {
        req.session.returnTo = req.originalUrl;
    }
    next();
};

module.exports.validateCampground = ( req , res, next ) => {
    console.log("Request body:", req.body); 
    const { error } =  campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
        }
        else {
        next();
        }
 }


module.exports.isAuthor = async (req, res, next) => {
   const { id } = req.params;
    const campground = await Campground.findById(id);      
    // Check if the logged-in user is the author
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to edit this campground');
        return res.redirect(`/campgrounds/${id}`); // Return early to prevent further execution
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
     const review = await Review.findById(reviewId);      
     // Check if the logged-in user is the author
     if (!review.author.equals(req.user._id)) {
         req.flash('error', 'You do not have permission to edit this campground');
         return res.redirect(`/campgrounds/${id}`); // Return early to prevent further execution
     }
     next();
 }

module.exports.validateReview = ( req,res ,next ) => {
    const result = reviewSchema.validate(req.body)
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join (',');
        throw new ExpressError(msg, 400)
        }
        else {
            next();
            }
            }


        