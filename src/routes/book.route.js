import express from 'express';
import { createBook, deleteBookById, getAllBook, getBookById, updateBookById } from '../controllers/book.controlller.js';
import { body } from 'express-validator';
import { handleValidation } from '../middlewares/index.js';
const bookRoute = express.Router();

bookRoute.get('/', getAllBook)

bookRoute.get('/:id', getBookById)

bookRoute.delete('/:id', deleteBookById)

bookRoute.post('/', 
    body('publishedYear').isInt({ min: 2000, max: 2025 }),
    body('title').isAlpha(),
    body('author').isAlpha(),
    handleValidation, createBook)

bookRoute.patch('/:id', updateBookById)

export default bookRoute;