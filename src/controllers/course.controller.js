import { courseModel } from '../models/course.model.js';
import asyncHandler from 'express-async-handler'

export const getAllCourses = asyncHandler (async (req, res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const populate = req.query.populate || ''
    const options = {
        page,
        limit,
        populate
    };
    let filterCourse = await courseModel.paginate({}, options)
    return res.json(filterCourse)
})

export const getCourseById = asyncHandler (async (req, res) => {
    const id = req.params.id;
    const user = await courseModel.findById(id)
    if (!user) {
        return res.json({ messsge: "Not Found" })
    }
    return res.json(user)
})

export const deleteCourseById = asyncHandler( async (req, res) => {
    const userId = req.params.id
    const result = await courseModel.deleteOne({ _id: userId })
    return res.json({ message: result })
})

export const updateCourseById = asyncHandler (async (req, res) => {
    const userId = req.params.id
    const result = await courseModel.updateOne({ _id: userId }, req.body)
    return res.status(200).json({ message: 'updated', data: result })
})

export const createCourse = asyncHandler (async (req, res) => {
    const user = new courseModel(req.body)
    await user.save()
    return res.status(201).json(user)
})
