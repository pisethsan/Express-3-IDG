import { teacherModel } from "../models/teacher.model.js";
import asyncHandler from 'express-async-handler'

export const getAllTeacher = asyncHandler(async (req, res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const populate = req.query.populate || ''
    const options = {
        page,
        limit,
        populate
    };
    let filterTeachers = await teacherModel.paginate({}, options)
    return res.json(filterTeachers)
})

export const getTeacherById = asyncHandler( async (req, res) => {
    const id = req.params.id;
    const user = await teacherModel.findById(id)
    if (!user) {
        return res.json({ messsge: "Not Found" })
    }
    return res.json(user)
})

export const deleteTeacherById = asyncHandler( async (req, res) => {
    const userId = req.params.id
    const result = await teacherModel.deleteOne({ _id: userId })
    return res.json({ message: result })
})

export const updateTeacherById = asyncHandler( async (req, res) => {
    const userId = req.params.id
    const result = await teacherModel.updateOne({ _id: userId }, req.body)
    return res.status(200).json({ message: 'updated', data: result })
})

export const createTeacher = asyncHandler (async (req, res) => {
    const user = new teacherModel(req.body)
    await user.save()
    return res.status(201).json(user)
})

// export const getAllTeacher = (req, res) => {
//     let filterTeachers = teachers
//     if (req.query.role) {
//         filterTeachers = teachers.filter((t) => {
//             return t.role == req.query.role
//         })
//     }
//     let subject = req.query.subject
//     if (subject) {
//         filterTeachers = filterTeachers.filter((t) => {
//             return t.subject == subject
//         })
//     }
    
//     let minExp = parseInt(req.query.minExp)
//     let maxExp = parseInt(req.query.maxExp)

//     if (minExp > maxExp) {
//         maxExp = minExp
//     }

//     if (req.query.minExp) {
//         filterTeachers = filterTeachers.filter((t) => {
//             return t.yearsOfExperience >= minExp
//         })
//     }
//     if (req.query.maxExp) {
//         filterTeachers = filterTeachers.filter((t) => {
//             return t.yearsOfExperience <= maxExp
//         })
//     }
//     return res.json(filterTeachers)
// }

// export const getTeacherById = (req, res) => {
//     const id = req.params.id;
//     const teacher = teachers.find((t) => {
//         return t.id == id
//     })
//     if (!teacher) {
//         return res.json({ messsge: "Not Found" })
//     }
//     return res.json(teacher)
// }

// export const deleteTeacherById = (req, res) => {
//     const teacherId = req.params.id
//     const deleteIndex = teachers.findIndex((t) => {
//         return t.id == teacherId
//     })
//     if (deleteIndex == -1) {
//         return res.json("Teacher not found");
//     }
//     teachers.splice(deleteIndex, 1)
//     return res.json({ message: `Teacher with Id ${teacherId} deleted` })
// }

// export const updateTeacherById = (req, res) => {
//     const teacherId = req.params.id
//     const teacherIndex = users.findIndex((t) => {
//         return teacherId == t.id
//     })
//     if (teacherIndex == -1) {
//         return res.json("Teacher not found");
//     }
//     teachers[teacherIndex] = { id: teacherId, ...req.body }
//     return res.json({ message: `Teacher with id ${teacherId} updated!` })
// }

// export const createTeacher = (req, res) => {
//     const id = req.body.id
//     const existIndex = teachers.findIndex((t) => {
//         return t.id == id
//     })
//     console.log(existIndex)
//     if (existIndex != -1) {
//         return res.status(400).json({ message: "Teacher exists" })
//     }
//     teachers.push(req.body)
//     return res.status(201).json({ message: `Teacher with name: ${req.body.name} created` })
// }