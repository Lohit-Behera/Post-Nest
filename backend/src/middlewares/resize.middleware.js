import sharp from "sharp";
import path from "path";
import fs from "fs";
import { ApiResponse } from "../utils/ApiResponse.js";

const __dirname = path.resolve();

sharp.cache(false);

export const resizeImage = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide an image"));
    }

    const imagePath = path.join(__dirname, req.file.path);
    const outputFilePath = path.join(__dirname, "./public/temp", `resized-${Date.now()}.jpg`);

    try {
        // Open and resize image with sharp
        const metadata = await sharp(imagePath).metadata();
        const aspectRatio = metadata.width / metadata.height;

        let newWidth = Math.min(1440, metadata.width);
        let newHeight = Math.round(newWidth / aspectRatio);

        if (newHeight > 1080) {
            newHeight = 1080;
            newWidth = Math.round(newHeight * aspectRatio);
        }

        // Resize, convert to RGB, and save as JPEG
        await sharp(imagePath)
            .resize(newWidth, newHeight)
            .toFormat("jpeg")
            .jpeg({ quality: 70 })
            .toFile(outputFilePath);

        // Replace the file with the resized version
        req.file.path = outputFilePath;
        req.file.filename = `resized-${Date.now()}.jpg`;
        fs.unlinkSync(imagePath);

        next();
    } catch (err) {
        console.error("Error processing image:", err);
        return res.status(500).json(
            new ApiResponse(500, err.message, "Something went wrong while processing image")
        );
    }
};

