import express from 'express';
import { createCourse, deleteCourseById, getAllCourses, getCourseById, updateCourseById } from '../controllers/course.controller.js';
import { createCourseValidator } from '../validators/course.validator.js';
import { handleValidation } from '../middlewares/index.js';


const courseRoute = express.Router();

courseRoute.get('/', getAllCourses)
courseRoute.get('/:id', getCourseById)
courseRoute.delete('/:id', deleteCourseById)
courseRoute.post('/',
    createCourseValidator,
    handleValidation,
    createCourse)
courseRoute.patch('/:id', updateCourseById)

export default courseRoute;