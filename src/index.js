import 'dotenv/config';

import express from 'express';
import bodyParser  from 'body-parser';
import userRoute from './routes/user.route.js';
import bookRoute from './routes/book.route.js';
import teacherRoute from './routes/teacher.route.js';
import moneyRoute from './routes/money.route.js';
import stockRoute from './routes/stock.route.js';
import courseRoute from './routes/course.route.js';
import { authenticate, handleError } from './middlewares/index.js';
import morgan from 'morgan';
import { dbConnect } from  './database/db.js';
import cors from 'cors';
import authRoute from './routes/auth.route.js';

dbConnect().catch((err) => {
    console.log(err)
})
const app = express();
// POST & PATCH & PUT
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(cors())


/**
 * Exercise : Create 5 resources
 * GET /api/books
 * GET /api/books/{id}
 * DELETE /api/books/{id}
 * 
 * GET /api/users
 * GET /api/users/{id}
 * DELETE /api/users/{id}
 * PATCH /api/users/{id} 
 * POST /api/users/{id} - If ID already exist - Not allowed, throw 400
 * 
 * GET /api/teachers
 * GET /api/teachers/{id}
 * DELETE /api/teachers/{id}
 * GET /api/money
 * GET /api/money/{id}
 * DELETE /api/money/{id}
 * GET /api/stock
 * GET /api/stock/{id}
 * DELETE /api/stock/{id}
 */

app.use('/api/users', authenticate, userRoute);
app.use('/api/books', authenticate, bookRoute);
app.use('/api/teachers', authenticate, teacherRoute);
app.use('/api/money', authenticate, moneyRoute);
app.use('/api/stocks', authenticate, stockRoute);
app.use('/api/courses', authenticate, courseRoute);
app.use('/api/auth', authRoute);

// Error handler
app.use(handleError)
//Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
})