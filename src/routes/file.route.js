import express from 'express';
import { uploadMultiple, uploadSingleFile } from '../controllers/file.controller.js';
import { upload, uploads } from '../middlewares/multer.js';



const fileRoute = express.Router();

fileRoute.post('/upload', upload, uploadSingleFile)
fileRoute.post('/uploads', uploads, uploadMultiple)


export default fileRoute;