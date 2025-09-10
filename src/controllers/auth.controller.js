import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import { userModel } from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import { faker } from '@faker-js/faker';
import { upload } from '../middlewares/multer.js';

// --- Merged signUp logic: your bcrypt/save + my file upload handling ---
export const signUp = asyncHandler(async (req, res) => {
  try {
    const { name, username, role, age, email, password } = req.body;

    // Basic validation for required fields from the client
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields: name, username, email, password.' });
    }

    // Hash the password before saving it to the database
    const encryptedPassword = await bcrypt.hash(password, 10);

    const userPayload = {
      name,
      username,
      email,
      age,
      role,
      password: encryptedPassword,
      avatar: faker.image.avatar()
    };

    console.log('User Payload:', userPayload);

    // 2. Create and save the new user document
    const newUser = new userModel(userPayload);
    const savedUser = await newUser.save();

    console.log('New User Profile Created:', savedUser);
    return res.status(201).json(savedUser);

  } catch (error) {
    console.error('Error creating user:', error);
    let errorMessage = 'An error occurred during user creation.';
    let statusCode = 500;
    if (error.name === 'ValidationError') {
      errorMessage = 'Validation error: ' + error.message;
      statusCode = 400; // Bad Request for validation errors
    } else if (error.code === 11000) {
      // Duplicate key error
      errorMessage = 'Username or email already exists.';
      statusCode = 409; // Conflict
    }
    res.status(statusCode).json({ message: errorMessage });
  }
});
export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    const user = await userModel.findOne({ username })
    // To prevent user enumeration attacks, we'll send the same error message
    // for "user not found" and "incorrect password".
    if (!user) {
        return res.status(401).json({ message: "Username or Password Incorrect!" })
    }
    const isMatched = await bcrypt.compare(password, user.password)
    if (!isMatched) {
        return res.status(401).json({ message: "Username or Password Incorrect!" })
    }
    // JWT
    const payload = {
        _id: user._id,
        username: user.username,
        role: user.role
    }
    const token = jwt.sign(
        payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    })
    return res.json({ accessToken: token })
})



//Old
// export const login = asyncHandler(async (req, res) => {
//     const { username, password } = req.body
//     const user = await userModel.findOne({ username: username })
//     if (!user) {
//         return res.status(404).json({ message: "User not found!" })
//     }
//     const isMatched = bcrypt.compare(password, user.password)
//     if (!isMatched) {
//         return res.status(401).json({ message: "Username or Password Incorrect!" })
//     }
//     // JWT
//     const payload = {
//         _id: user._id,
//         username: user.username,
//         role: user.role
//     }
//     const token = jwt.sign(
//         payload, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRE_IN
//     })
//     return res.json({ accessToken: token })

//     // return res.status(400).json({ message: 'Invalid credential' })
// })

// export const signUp = asyncHandler(async (req, res) => {
//     const { name, username, role, age, email, password } = req.body
//     const encrypedPassword = bcrypt.hashSync(password, 10)
//     const user = new userModel({
//         name,
//         username,
//         age,
//         role,
//         email,
//         password: encrypedPassword
//     })
//     await user.save()
//     return res.json(user)
// })

// // export const login = asyncHandler(async (req, res) => {
// //     const username = req.body.username;
// //     const password = req.body.password;
// //     // Login
// //     if (username == 'demo' && password == 'password123') {
// //         return res.json({ token: 'abcz123cadt' })
// //     }
// //     return res.status(400).json({ message: 'Invalid credential' })
// // })