
import express from 'express';
import { getAllFiles , deleteFileById, getFileById, uploadMultiple, uploadSingleFile } from '../controllers/file.controller.js';
import { upload, uploads } from '../middlewares/multer.js';



const fileRoute = express.Router();

fileRoute.post('/upload', upload, uploadSingleFile)
fileRoute.post('/uploads', uploads, uploadMultiple)
fileRoute.get('/:id', getFileById)
fileRoute.delete('/:id', deleteFileById);
fileRoute.get('/', getAllFiles);


export default fileRoute;
