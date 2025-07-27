import { checkSchema } from "express-validator";
import { courseModel } from "../models/course.model.js";
import { teacherModel } from "../models/teacher.model.js";

export const createCourseValidator = checkSchema({
    title: {
        isString: true,
        notEmpty: true,
        errorMessage: "Title is required and must be a string.",
        custom: {
            options: async (value) => {
                const course = await courseModel.findOne({ title: value });
                if (course) {
                    throw new Error(`Course with title: ${value} already exists`);
                }
            }
        }
    },
    credit: {
        isInt: {
            options: {
                min: 1,
                max: 50
            }
        },
        errorMessage: "Credit must be an integer between 1 and 10."
    },
    description: {
        isString: true,
        notEmpty: true,
        errorMessage: "Description is required and must be a string."
    },
    'taughtBy': {
        isArray: {
            options: { min: 1 }
        },
        errorMessage: 'At least one teacher must be assigned to the course and must be an array of teacher IDs.',
    },
    'taughtBy.*': {
        isMongoId: true,
        errorMessage: 'Each item in taughtBy must be a valid MongoDB ObjectId.',
        custom: {
            options: async (value) => {
                const teacher = await teacherModel.findById(value);
                if (!teacher) {
                    return Promise.reject(`Teacher with ID: ${value} does not exist.`);
                }
            }
        }
    }
})