import express from 'express';
import { createUser, deleteUserById, getAllUser, getUserById, updateUserById } from '../controllers/user.controller.js';
import { userMiddleware, handleValidation } from '../middlewares/index.js';
import { createUserValidator } from '../validators/user.validator.js';
import { upload } from '../middlewares/multer.js';

const userRoute = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         profileImage:
 *           type: string
 *           description: URL of the user's profile image
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         username: johndoe
 *         email: johndoe@example.com
 *         profileImage: 'http://example.com/images/johndoe.jpg'
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *     PaginatedUsers:
 *       type: object
 *       properties:
 *         docs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserResponse'
 *         totalDocs:
 *           type: integer
 *           description: Total number of documents
 *         limit:
 *           type: integer
 *           description: The limit for the pagination
 *         page:
 *           type: integer
 *           description: The current page number
 *         totalPages:
 *           type: integer
 *           description: The total number of pages
 *         pagingCounter:
 *           type: integer
 *           description: The starting number of the paging
 *         hasPrevPage:
 *           type: boolean
 *           description: Whether there is a previous page
 *         hasNextPage:
 *           type: boolean
 *           description: Whether there is a next page
 *         prevPage:
 *           type: integer
 *           nullable: true
 *           description: The previous page number
 *         nextPage:
 *           type: integer
 *           nullable: true
 *           description: The next page number
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search for users by username or email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [username, email, createdAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (asc or desc)
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedUsers'
 */
userRoute.get('/', userMiddleware, getAllUser)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: The user was not found
 */
userRoute.get('/:id', getUserById)

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */
userRoute.delete('/:id', deleteUserById)

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request
 */
userRoute.post('/',
    upload,
    createUserValidator,
    handleValidation,
    createUser
)

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update the user by the id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: The user was not found
 *       400:
 *         description: Bad request
 */
userRoute.patch('/:id', updateUserById)

export default userRoute;