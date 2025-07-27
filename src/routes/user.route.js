import express from 'express';
import { createUser, deleteUserById, getAllUser, getUserById, updateUserById } from '../controllers/user.controlller.js';
import { userMiddleware, handleValidation } from '../middlewares/index.js';
import { createUserValidator } from '../validators/user.validator.js';

const userRoute = express.Router();

userRoute.get('/', userMiddleware, getAllUser)

userRoute.get('/:id', getUserById)

userRoute.delete('/:id', deleteUserById)

userRoute.post('/',
    createUserValidator,
    handleValidation,
    createUser
)

userRoute.patch('/:id', updateUserById)

export default userRoute;