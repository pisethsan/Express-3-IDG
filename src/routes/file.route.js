
import express from 'express';
import { getAllFiles , deleteFileById, getFileById, uploadMultiple, uploadSingleFile, updateFileById } from '../controllers/file.controller.js';
import { upload, uploads } from '../middlewares/multer.js';



const fileRoute = express.Router();

fileRoute.post('/upload', upload, uploadSingleFile)
fileRoute.post('/uploads', uploads, uploadMultiple)
fileRoute.get('/:id', getFileById)
fileRoute.delete('/:id', deleteFileById);
fileRoute.get('/', getAllFiles);
fileRoute.patch('/:id',upload, updateFileById)



export default fileRoute;
