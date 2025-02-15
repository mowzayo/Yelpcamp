const Campground = require('../models/Campground');
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;



maptilerClient.config.fetch = fetch;


    module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render ('campgrounds/index', { campgrounds} )
    }



    module.exports.renderNewForm = (req, res) => {
        res.render ('campgrounds/new');
        }


   module.exports.createCampground = async (req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}
      


    module.exports.showCampground = async (req, res) => {
                        const campground = await Campground.findById(req.params.id)
                        .populate({
                                path: 'reviews',
                                populate: {
                                    path: 'author', // Ensure the author field is populated
                                    model: 'User'   // Replace 'User' with the actual name of your User model
                                }
                            })
                            .populate('author');
                            console.log(campground);
                        if (!campground) {
                            req.flash('error', 'Campground not found');
                            return res.redirect('/campgrounds');
                        }
                
                        res.render('campgrounds/show', { campground, currentUser: req.user });
                    } 
                
    module.exports.renderEditForm = async (req, res) => {
                        const campground = await Campground.findById(req.params.id);
                        res.render ('campgrounds/edit', { campground });
                        }
    module.exports.updateCampground = async (req, res, next) => {
                            try {
                              const { id } = req.params;
                              const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
                              const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
                              campground.geometry = geoData.features[0].geometry; 
                              if (!campground) {
                                req.flash('error', 'Campground not found!');
                                return res.redirect('/campgrounds');
                              }
                              const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
                              campground.images.push(...imgs);
                              await campground.save();
                              if(req.body.deleteImages) {
                                for (let filename of req.body.deleteImages) {
                                  await cloudinary.uploader.destroy(filename);
                              }
                                await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
                              console.log(campground)
                              }
                              req.flash('success', 'Successfully updated campground!');
                              res.redirect(`/campgrounds/${campground._id}`);
                            } catch (err) {
                              next(err); // Pass the error to the error handler middleware
                            }
                          };
                          

    module.exports.deleteCampground =  async (req, res) => {
                            const { id } = req.params;
                            await Campground.findByIdAndDelete(id);
                            req.flash ('success', 'Campground deleted successfully');
                            res.redirect('/campgrounds');
                            }