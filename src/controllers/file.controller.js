import { minioClient } from "../middlewares/multer.js";
import { fileModel } from "../models/file.model.js";
import asyncHandler from 'express-async-handler'

export const uploadSingleFile = asyncHandler(async (req, res) => {
    const file = req.file;
    const newFile = new fileModel(file)
    await newFile.save();
    res.json(file);
});

export const uploadMultiple = asyncHandler (async (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }
    // console.log(files)
    const fileModels = files.map(file => new fileModel(file));
    await Promise.all(fileModels.map(fileModel => fileModel.save()));
    res.json(files);
});

export const getFileById = asyncHandler (async (req, res) => {
    const fileId = req.params.id;
    const file = await fileModel.findById(fileId);
    const fileStream = await minioClient.getObject(file.bucket, file.filename);
    res.set({
        'Content-Type': file.mimetype,
        'Content-Disposition': `attachment; filename="${file.originalname}"`
    });
    return fileStream.pipe(res);
})

export const deleteFileById = asyncHandler (async (req, res) => {
    const fileId = req.params.id;
    const file = await fileModel.findById(fileId);
    if (!file) {
        return res.status(404).json({ message: "File not found" });
    }
    await minioClient.removeObject(file.bucket, file.filename, {})
    return res.status(200).json({ message: "File deleted successfully" });
});

export const getAllFiles = asyncHandler (async (req, res) => {
    const files = await fileModel.find();
    res.json(files);
});

export const updateFileById = asyncHandler (async (req, res) => {
    const fileId = req.params.id;
    const newFile = req.file;

    if (!newFile) {
        return res.status(400).json({ message: "No file uploaded for update." });
    }

    // Find the old file document to get its details for deletion from MinIO
    const oldFile = await fileModel.findById(fileId);
    if (!oldFile) {
        // If the old file record doesn't exist, we can't delete it from MinIO.
        // We've uploaded a new file but there's no record to update.
        // It's probably best to delete the newly uploaded file to avoid orphans.
        await minioClient.removeObject(newFile.bucket, newFile.filename);
        return res.status(404).json({ message: "File record not found to update." });
    }

    // Delete the old file from MinIO
    try {
        await minioClient.removeObject(oldFile.bucket, oldFile.filename, {});
    } catch (err) {
        console.error(`Failed to delete old file ${oldFile.filename} from MinIO, but proceeding with DB update. Error: ${err}`);
        // Depending on the use case, you might want to stop here.
        // For now, we'll just log the error and continue.
    }

    // Update the document in MongoDB with the new file's information
    const { filename, originalname, path, mimetype, encoding, bucket, size } = newFile;
    const updatedFile = await fileModel.findByIdAndUpdate(fileId, 
        { filename, originalname, path, mimetype, encoding, bucket, size }, 
        { new: true }
    );

    return res.status(200).json({ message: 'File updated successfully', data: updatedFile });
});