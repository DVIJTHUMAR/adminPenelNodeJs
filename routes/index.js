const express = require('express');
const routes = express.Router();
const adminController = require('../controllers/adminControllers');
const bodyParser = require('body-parser');
const upload = require('../middlewers/uploadImg');
const passport = require('../middlewers/passport-local');
const authMiddle = require('../middlewers/authMiddlerwer');


routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

routes.get('/', authMiddle, adminController.defultController);
routes.get('/signin', adminController.signInController);
routes.get('/signup', adminController.signUpController);
routes.get('/logoutAdmin', adminController.logoutAdminController)

routes.get('/forgotuser',adminController.forgotuserController);
routes.post('/forgotData',adminController.forgotDataController);

routes.get('/otp',adminController.otpController);
routes.post('/otpData',adminController.otpDataController);
routes.get('/otpLink',adminController.otpLinkController);

routes.get('/forgotConfirm',adminController.forgotConfirmController);
routes.get('/forgotConfirm/:t',adminController.forgotConfirmController);
routes.post('/forgotConfirmData',adminController.forgotConfirmDataController);

routes.post('/registeradmin', adminController.addAdminController);
routes.post('/loginAdmin', passport.authenticate('local', { failureRedirect: '/signin' }), adminController.loginAdminController);


routes.get('/formData', adminController.formdataController);

routes.get('/blogForm', adminController.addBlogController);
routes.post('/blogForm', upload.single('movieImg'), adminController.addBlogController);
routes.get('/viewData', adminController.viewBlogController);
routes.get('/userData', adminController.userBlogController);
routes.get("/deleteMovie/:id", adminController.deleteBlogController);
routes.get("/editMovie/:id", adminController.editBlogController);

routes.get("/changePassword", adminController.changePasswordController);
routes.post("/newPassword", adminController.newPasswordController);

routes.get("/myProfile", adminController.myProfileController);
routes.get("/editMyProfile/:id", adminController.editMyProfileController);
routes.post("/editUpdateProfile", adminController.updateProfileController);

routes.get("/category", adminController.addCategoryController);
routes.post("/categoryForm", adminController.categoryFormController);

routes.post("/subCategoryForm", adminController.subCategoryFormController);




module.exports = routes;