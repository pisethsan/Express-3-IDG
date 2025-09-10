import express from 'express';
import { login, signUp } from '../controllers/auth.controller.js';
import { upload } from '../middlewares/multer.js';

const authRoute = express.Router();

/**
 *  * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication Module
 */


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: seth
 *               password:
 *                 type: string
 *                 example: pisethsan
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
authRoute.post('/login', login)


/**
 * @swagger
 * /api/auth/sign-up:
 *   post:
 *     summary: Sign up user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed up successfully
 *       401:
 *         description: Invalid credentials
 */
authRoute.post('/sign-up', upload, signUp)

export default authRoute;