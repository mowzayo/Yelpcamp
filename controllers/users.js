const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
    }

 module.exports.register = async (req, res, next) => {
        try {
        const {email, username,  password } = req.body;
       const user = new User ({email, username })

         const registereduser = await User.register (user, password)

         req.login (registereduser, err => {
            if (err) return next (err)

            req.flash ('success', 'Welcome to Yelp Camp!');
            return res.redirect ('/campgrounds')
         })

        } catch (e) {
            req.flash ('error', e.message);
            return res.redirect('/register');
            }}

 module.exports.renderLogin =  (req, res) => {
                res.render('users/login');
                }

module.exports.login = (req, res) => {
    req.flash ('success', 'Welcome back');
     const redirectUrl = req.session.returnTo || '/campgrounds';
     delete req.session.returnTo; // Clear the returnTo value
     res.redirect(redirectUrl);
     
     }              

 module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}  