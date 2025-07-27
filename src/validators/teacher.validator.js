import { checkSchema } from "express-validator";
import { teacherModel } from "../models/teacher.model.js";

export const createTeacherValidator = checkSchema({
    name: {
        matches: {
            options: [/^[A-Za-z\s]+$/]
        },
        errorMessage: "Only letters and space allowed",
        custom: {
            options: async (value) => {
                const teacher = await teacherModel.findOne({ name: value })
                if (teacher)
                    throw new Error(`Teacher with name: ${value} already exists`)
            }
        }
    },
    yearsOfExperience: {
        isInt: {
            options: {
                min: 1,
                max: 50
            }
        },
        errorMessage: "Minimum years of experience is 1, and maximum is 50"
    },
    subject: {
        isIn: {
            options: [["Math", "English", "Khmer"]]
        },
        errorMessage: "Subject must be among Math, English, Khmer"
    }
})