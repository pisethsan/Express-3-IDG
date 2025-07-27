import { userModel } from "../models/user.model.js";
import asyncHandler from 'express-async-handler'

export const getAllUser = asyncHandler (async (req, res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const populate = req.query.populate || ''
    const options = {
        page,
        limit,
        populate
    };
    let filterUsers = await userModel.paginate({}, options)
    if (req.query.role) {
        filterUsers = users.filter((u) => {
            return u.role == req.query.role
        })
    }
    let minAge = parseInt(req.query.minAge)
    let maxAge = parseInt(req.query.maxAge)

    if (minAge > maxAge) {
        maxAge = minAge
    }

    if (req.query.minAge) {
        filterUsers = filterUsers.filter((u) => {
            return u.age >= minAge
        })
    }
    if (req.query.maxAge) {
        filterUsers = filterUsers.filter((u) => {
            return u.age <= maxAge
        })
    }
    return res.json(filterUsers)
})

export const getUserById = asyncHandler( async (req, res) => {
    const id = req.params.id;
    const user = await userModel.findById(id)
    if (!user) {
        return res.json({ messsge: "Not Found" })
    }
    return res.json(user)
})

export const deleteUserById = asyncHandler( async (req, res) => {
    const userId = req.params.id
    const result = await userModel.deleteOne({ _id: userId })
    return res.json({ message: result })
})

export const updateUserById = asyncHandler (async (req, res) => {
    const userId = req.params.id
    const result = await userModel.updateOne({ _id: userId }, req.body)
    return res.status(200).json({ message: 'updated', data: result })
})

export const createUser = asyncHandler( async (req, res) => {
    const user = new userModel(req.body)
    await user.save()
    return res.status(201).json(user)
})


// export const getAllUser = (req, res) => {
//     let filterUsers = users
//     if (req.query.role) {
//         filterUsers = users.filter((u) => {
//             return u.role == req.query.role
//         })
//     }
//     let minAge = parseInt(req.query.minAge)
//     let maxAge = parseInt(req.query.maxAge)

//     if (minAge > maxAge) {
//         maxAge = minAge
//     }

//     if (req.query.minAge) {
//         filterUsers = filterUsers.filter((u) => {
//             return u.age >= minAge
//         })
//     }
//     if (req.query.maxAge) {
//         filterUsers = filterUsers.filter((u) => {
//             return u.age <= maxAge
//         })
//     }
//     return res.json(filterUsers)
// }

// export const getUserById = (req, res) => {
//     const id = req.params.id;
//     const user = users.find((u) => {
//         return u.id == id
//     })
//     if (!user) {
//         return res.json({ messsge: "Not Found" })
//     }
//     return res.json(user)
// }

// export const deleteUserById = (req, res) => {
//     const userId = req.params.id
//     const deleteIndex = users.findIndex((u) => {
//         return u.id == userId
//     })
//     if (deleteIndex == -1) {
//         return res.json("User not found");
//     }
//     users.splice(deleteIndex, 1)
//     return res.json({ message: `User with Id ${userId} deleted` })
// }

// export const updateUesrById = (req, res) => {
//     const userId = req.params.id
//     const userIndex = users.findIndex((u) => {
//         return userId == u.id
//     })
//     if (userIndex == -1) {
//         return res.json("User not found");
//     }
//     users[userIndex] = { id: userId, ...req.body }
//     return res.json({ message: `User with id ${userId} updated!` })
// }

// export const createUser = (req, res) => {
//     const id = req.body.id
//     const existIndex = users.findIndex((u) => {
//         return u.id == id
//     })
//     console.log(existIndex)
//     if (existIndex != -1) {
//         return res.status(400).json({ message: "User exists" })
//     }
//     users.push(req.body)
//     return res.status(201).json({ message: `User with name: ${req.body.name} created` })
// }