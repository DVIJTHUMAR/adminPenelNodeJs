const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
// Models
const adminModel = require('../model/userAdminModel');

passport.use(new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password'

},

    async (email, password, next) => {

       const loginAdmin = await adminModel.findOne({ email }).then((data) => {
            if (data != null) {
                bcrypt.compare(password, data.password, (err, result) => {
                    console.log("result", data.password);

                    if (data.length != 0) {
                        if (result) {
                            // res.cookie("singleCookie", loginAdmin[0].id)
                            // userId = loginAdmin[0].id;
                            console.log("login succesfully....");
                            return next(null, data);
                        } else {
                            return next(null, false)
                        }
                    } else {
                        return next(null, false)
                    }
                });
            } else {
                console.log("user data not found");
                return next(null, false)
            }
        }).catch((err) => {
            return next(err)
        });
    }
));

passport.serializeUser((admin, next) => {
    console.log("user serialize...", admin);
    next(null, admin.id);
});

passport.deserializeUser((id, next) => {
    console.log("user deserialize");
    adminModel.findById(id).then((admin) => {
        return next(null, admin);
    }).catch((err) => {
        return next(err, null)
    })
})
module.exports = passport;