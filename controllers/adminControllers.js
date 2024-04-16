const adminModel = require('../model/userAdminModel');
const userAdminModel = require('../model/userAdminModel');
const movieModel = require('../model/movieModel');
const typeModel = require('../model/typeModel');
const subTypeModel = require('../model/subTypeModel');
const fs = require('fs');
var userId;
const bcrypt = require('bcrypt');
var flash = require('connect-flash');
const otp = require('otp-generator');
const passport = require('passport');
const nodemailer = require("nodemailer");
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "dvijpatel222@gmail.com",
        pass: "xmzdozdkazjkxzsg",
    },
});

const defultController = (req, res) => {
    try {
        // if (req.user) {

        //     req.flash('info', 'Flash is back!')

        //     res.render("index", { message: req.flash("info") });

        // } else {
        //     res.redirect('/signin');
        // }
        req.flash('info', 'Flash is back!')

        res.render("index", { message: req.flash("info") });
    } catch (error) {
        console.log('Error', error);
    }
}

const signInController = (req, res) => {
    try {
        res.render("signin");
    } catch (error) {
        console.log('Error', error);
    }
}

const signUpController = (req, res) => {
    try {
        res.render("signup");
    } catch (error) {
        console.log('Error', error);
    }
}

const addAdminController = async (req, res) => {
    try {
        console.log(req.body);

        const { username, email, password } = req.body;
        let saltRounds = 11;

        bcrypt.hash(password, saltRounds, async (err, hash) => {
            console.log("hash>>", hash);
            const adminsData = new userAdminModel({
                username,
                email,
                password: hash,

            })
            await adminsData.save();
        });

        res.redirect('/signin')

    } catch (error) {
        console.log('Error in adding admin: ', error);
        res.redirect('/signup');
    }
}

const loginAdminController = async (req, res) => {


    res.redirect('/');


}

const logoutAdminController = (req, res) => {

    res.clearCookie("singleCookie");

    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/signin');
    });

}

const changePasswordController = (req, res) => {
    res.render('changePassword')
}

const newPasswordController = async (req, res) => {
    let { oldPassword, newPassword, confirmPassword } = req.body;

    const passId = req.cookies.singleCookie;

    const userData = await adminModel.findById(passId)
    let saltRounds = 11;

    bcrypt.compare(oldPassword, userData.password, async (err, result) => {
        // console.log("result old passss", result);

        if (result) {
            if (newPassword == confirmPassword) {
                bcrypt.hash(newPassword, saltRounds, async (err, hash) => {

                    await adminModel.findByIdAndUpdate(passId, {
                        password: hash
                    });

                });

                res.redirect('/logoutAdmin')

            } else {
                return res.send('<h1>New Passwords do not match!</h1>')
            }
        } else {

            return res.send('<h1>Incorrect Old Password!</h1>')
        }
    });


}

const forgotuserController = (req, res) => {
    res.render('forgotUser');
}

const forgotDataController = async (req, res) => {

    let { email } = req.body;

    await adminModel.findOne({ email }).then((user) => {
        console.log('user.....', user);

        if (user != null) {
            let myOtp = otp.generate(4, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

            const token = crypto.randomBytes(20).toString('hex');

            user.resetToken = token;
            user.expireToken = Date.now() + 10 * 60 * 1000; // 10 mins from now

            user.save();

            const url = `http://localhost:3002/forgotConfirm/${token}`;
            console.log(url);

            const message = `To reset your password click on this link ${url}`;
            const messageOTP = `To reset your password OTP ${myOtp}`;

            const { linkBtn, otpBtn } = req.body;

            if (linkBtn) {
                const mailOptions = {
                    from: "dvijpatel222@gmail.com",
                    to: user.email,
                    subject: "Reset Your Password Click  Here To Reset It.",
                    text: message,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error sending email: ", error);
                    } else {
                        console.log("Email sent: ", info.response);
                    }
                });
                res.redirect('/otpLink');

            } else {
                const mailOptionsOTP = {
                    from: "dvijpatel222@gmail.com",
                    to: user.email,
                    subject: "Reset Your Password OTP  Here To Reset It.",
                    text: messageOTP,
                };

                transporter.sendMail(mailOptionsOTP, (error, info) => {
                    if (error) {
                        console.error("Error sending email: ", error);
                    } else {
                        console.log("Email sent: ", info.response);
                    }
                });
                res.cookie('otp', myOtp)
                res.cookie('userId', user.id)
                res.redirect('/otp');
            }
        } else {
            res.redirect("/forgotUser");
        }
    });
}

const otpController = (req, res) => {


    res.render('otp')
}

const otpDataController = (req, res) => {
    let myOtp = req.body.otp;

    if (myOtp == req.cookies.otp) {
        res.redirect('/forgotConfirm')
    } else {
        res.redirect('/forgotUser')
    }

}

// link otp start

const otpLinkController = (req, res) => {
    res.render('otpLink')
}


// link otp end

const forgotConfirmController = (req, res) => {
    res.render('forgotConfirm')
}

const forgotConfirmDataController = async (req, res) => {

    let { newPassword, confirmPassword } = req.body;
    let { userId } = req.cookies;


    console.log("pass id", userId);


    let saltRounds = 11;

    if (newPassword == confirmPassword) {

        bcrypt.hash(newPassword, saltRounds, async (err, hash) => {

            console.log("password updated", hash);

            await adminModel.findByIdAndUpdate(userId, {
                password: hash
            });


        });

        res.redirect('/logoutAdmin')

    } else {
        return res.send('<h1>New Passwords do not match!</h1>')
    }
}

//my profile start

const myProfileController = async (req, res) => {

    // const profileId = req.cookies.singleCookie;
    const profileId = req.user;

// const allll = adminModel.findOne();

    // console.log("my proooo iddd",profileId);
    // console.log("my proooo alllll",allll);
    const myProfileData = await adminModel.findById(profileId);

    console.log("my proooo",myProfileData);

    // console.log("myProfileData", myProfileData.username);

    res.render('myProfile', { myProfileData });
}

const editMyProfileController = async (req, res) => {

    const profileId = req.params.id;

    const singleprofileId = await adminModel.findById(profileId)

    console.log("singleprofileIdsingleprofileId", singleprofileId);

    res.render('editMyProfile', { singleprofileId })

}

const updateProfileController = async (req, res) => {

    const { editProId } = req.body;

    console.log("updateProfileController: ", editProId);

    await adminModel.findByIdAndUpdate(editProId, {

        userName: req.body.userName,
        email: req.body.email,
        bio: req.body.bio,

    })

    console.log("Edit Profile Done..");
    res.redirect("/myProfile");
}




//my profile end


// form controller start

const formdataController = async (req, res) => {

    try {

        const adminDataId = req.cookies.singleCookie;

        const typeDataId = await typeModel.find();

        res.render("form", { adminDataId, typeDataId });
    } catch (error) {
        console.log('Error', error);
    }

}



const addBlogController = async (req, res) => {

    var { editId } = req.body;

    if (!editId) {
        const movieData = new movieModel({
            adminId: userId,
            movieName: req.body.movieName,
            price: req.body.price,
            categoryId: req.body.categoryName,
            description: req.body.description,
            rating: req.body.rating,
            movieImage: req.file.path

        })
        console.log('movie data', movieData);

        await movieData.save();
    } else {

        await movieModel.findByIdAndUpdate(editId, {

            movieName: req.body.movieName,
            price: req.body.price,
            type: req.body.type,
            description: req.body.description,
            rating: req.body.rating,

        })
        console.log("Edit Done..");
    }
    res.redirect("/viewData");
}

const viewBlogController = async (req, res) => {
    const MovieCards = await movieModel.find({}).populate('categoryId').exec();

    res.render('view', { MovieCards });
    console.log("viwes Done...");

}

const deleteBlogController = async (req, res) => {
    const id = req.params.id;

    let deleteMovie = await movieModel.findOne({ _id: id });

    console.log('deleteMovie', deleteMovie);

    fs.unlinkSync(`${deleteMovie.movieImage}`)

    await movieModel.deleteOne({ _id: id });
    res.redirect("/viewData");
    console.log("delete done....");
}

const editBlogController = async (req, res) => {
    const id = req.params.id;

    const singleMovie = await movieModel.findById(id)

    res.render("edit", { singleMovie });

}

const userBlogController = async (req, res) => {
    const MovieCards1 = await movieModel.find({}).populate('categoryId').exec();;

    res.render('userData', { MovieCards1, userId });
    console.log("viwes Done...");
}
// form controller end

// cetegory start

const addCategoryController = (req, res) => {
    res.render('category')
}
const categoryFormController = async (req, res) => {

    const typeData = new typeModel({

        categoryName: req.body.categoryName,


    })
    console.log('typeData data', typeData);

    await typeData.save();

    res.redirect('/category');
}
// category end

// sub category start

const subCategoryFormController = async (req, res) => {
    const subTypeData = new subTypeModel({

        subCategoryName: req.body.subCategoryName,


    })
    console.log('subTypeData', subTypeData);

    await subTypeData.save();

    res.redirect('/category');

}

// sub category end

module.exports = { defultController, signInController, signUpController, addAdminController, loginAdminController, logoutAdminController, changePasswordController, newPasswordController, formdataController, addBlogController, viewBlogController, deleteBlogController, editBlogController, userBlogController, myProfileController, editMyProfileController, updateProfileController, addCategoryController, categoryFormController, subCategoryFormController, forgotuserController, forgotDataController, otpController, otpDataController, forgotConfirmController, forgotConfirmDataController, otpLinkController }