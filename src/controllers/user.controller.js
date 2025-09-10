import { userModel } from '../models/user.model.js';
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

//const asyncHandler = require('express-async-handler');

export const getAllUser = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const populate = req.query.populate || '';

  const query = {};
  if (req.query.role) {
    query.role = req.query.role;
  }
  if (req.query.minAge || req.query.maxAge) {
    query.age = {};
    if (req.query.minAge) {
      query.age.$gte = parseInt(req.query.minAge);
    }
    if (req.query.maxAge) {
      query.age.$lte = parseInt(req.query.maxAge);
    }
  }

  const options = {
    page,
    limit,
    populate,
    // Note: Mongoose paginate handles sorting. If you need it, add it here.
    // E.g., sort: { createdAt: -1 }
  };
  
  const users = await userModel.paginate(query, options);
  
  return res.json(users);
});


export const getUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findById(id);
  if (!user) {
    return res.status(404).json({ message: "Not Found" });
  }
  return res.json(user);
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // No need to delete files from MinIO anymore since we are just storing an avatar URL.

  // Delete the user document
  await userModel.deleteOne({ _id: userId });
  return res.json({ message: "User and associated files deleted successfully" });
});

export const updateUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const result = await userModel.updateOne({ _id: userId }, req.body);
  return res.status(200).json({ message: 'updated', data: result });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, username, email, age, password, role } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields: name, username, email, password.' });
  }

  // Hash the password
  const encryptedPassword = await bcrypt.hash(password, 10);

  const userPayload = { name, username, email, age, role, password: encryptedPassword, avatar: faker.image.avatar() };

  try {
    const newUser = new userModel(userPayload);
    const savedUser = await newUser.save();

    return res.status(201).json(savedUser);

  } catch (error) {
    console.error('Error creating user:', error);
    let errorMessage = 'An error occurred during user creation.';
    let statusCode = 500;

    if (error.name === 'ValidationError') {
      errorMessage = 'Validation error: ' + error.message;
      statusCode = 400;
    } else if (error.code === 11000) {
      errorMessage = 'Username or email already exists.';
      statusCode = 409;
    }
    res.status(statusCode).json({ message: errorMessage });
  }
});

//old
// export const getAllUser = asyncHandler (async (req, res) => {
//     const limit = req.query.limit || 10
//     const page = req.query.page || 1
//     const populate = req.query.populate || ''
//     const options = {
//         page,
//         limit,
//         populate
//     };
//     let filterUsers = await userModel.paginate({}, options)
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
// })

// export const getUserById = asyncHandler( async (req, res) => {
//     const id = req.params.id;
//     const user = await userModel.findById(id)
//     if (!user) {
//         return res.json({ messsge: "Not Found" })
//     }
//     return res.json(user)
// })

// export const deleteUserById = asyncHandler( async (req, res) => {
//     const userId = req.params.id
//     const result = await userModel.deleteOne({ _id: userId })
//     return res.json({ message: result })
// })

// export const updateUserById = asyncHandler (async (req, res) => {
//     const userId = req.params.id
//     const result = await userModel.updateOne({ _id: userId }, req.body)
//     return res.status(200).json({ message: 'updated', data: result })
// })

// export const createUser = asyncHandler( async (req, res) => {
//     const user = new userModel(req.body)
//     await user.save()
//     return res.status(201).json(user)
// })


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