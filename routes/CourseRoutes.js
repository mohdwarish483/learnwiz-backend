import express from "express";
import {
  addLecture,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllCourses,
  getCourseLectures,
} from "../controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";
import {
  authorizeAdmin,
  authorizeSubscribers,
  isAuthenticated,
} from "../middlewares/auth.js";
const router = express.Router();
// get all courses without lectures
router.route("/allcourses").get(getAllCourses);

// create new course by admin

router
  .route("/createcourse")
  .post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);

// Add lectures , delete course ,get course details

router
  .route("/course/:id") // passing route parameters in the route path to extract them with req.params;
  .get(isAuthenticated, authorizeSubscribers, getCourseLectures)
  .post(isAuthenticated, authorizeAdmin, singleUpload, addLecture)
  .delete(isAuthenticated, authorizeAdmin, deleteCourse);

// Delete Lecture by passing query parameters in the url of the req defined with ?courseid=73737&lectureId=88488898 and extract them with req.query;

router.route("/lecture").delete(isAuthenticated, authorizeAdmin, deleteLecture);

export default router;
