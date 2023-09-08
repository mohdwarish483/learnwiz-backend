import express from "express";
import {
  addToPlaylist,
  deleteMyProfile,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getChangePassword,
  getMyProfile,
  login,
  logout,
  register,
  removeFromPlaylist,
  resetPassword,
  updateProfile,
  updateUserRole,
  updateprofilepicture,
} from "../controllers/userController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
const router = express.Router();

// to register a new user
// singleupload is a multer middleware to handle form data
router.route("/register").post(singleUpload, register);
// login
router.route("/login").post(login);
// logout
router.route("/logout").get(logout);

//get my profile and delete my profile

router
  .route("/myp")
  .get(isAuthenticated, getMyProfile)
  .delete(isAuthenticated, deleteMyProfile);

// change password
router.route("/changepassword").put(isAuthenticated, getChangePassword);

// update profile
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword/:token").put(resetPassword);
router
  .route("/updateprofilepicture")
  .put(isAuthenticated, singleUpload, updateprofilepicture);

// add to playlist
router.route("/addtoplaylist").post(isAuthenticated, addToPlaylist);

// remove from playlist
router.route("/removefromplaylist").delete(isAuthenticated, removeFromPlaylist);

// admin routers

router
  .route("/admin/allusers")
  .get(isAuthenticated, authorizeAdmin, getAllUsers);

// changing user role and deleteting an user
router
  .route("/admin/user/:id")
  .put(isAuthenticated, authorizeAdmin, updateUserRole)
  .delete(isAuthenticated, authorizeAdmin, deleteUser);
export default router;
