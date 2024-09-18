import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ApiResponse } from './ApiResponse.js';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (filePath) => {
    try {
        if(!filePath) return null;
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
        fs.unlinkSync(filePath);
        return response.url;
    } catch (error) {
        fs.unlinkSync(filePath);
        return null;
    }
}

const deleteFile = async (filePath, res) => {
    try {
        if(!filePath){
            return  res.status(500).json(new ApiResponse(500, {}, "file path not provided"));
        }
        const response = await cloudinary.uploader.destroy(filePath);
        console.log(response);
        return response;
    } catch (error) {
        return  res.status(500).json(new ApiResponse(500, error.message, "Something went wrong while deleting file"));
    }
}

export { uploadFile, deleteFile }