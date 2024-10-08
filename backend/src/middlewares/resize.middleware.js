import sharp from "sharp";
import path from "path";
import fs from "fs";
import { ApiResponse } from "../utils/ApiResponse.js";

sharp.cache(false);

const __dirname = path.resolve();

export const resizeImage = async (req, res, next) => {
    // Handle both req.file and req.files
    const files = req.files || (req.file ? { image: [req.file] } : null);

    if (files) {
        try {
            // Use Object.keys to iterate through each field (e.g., avatar, coverImage)
            const fileFields = Object.keys(files);

            for (const fieldName of fileFields) {
                const fileArray = files[fieldName];

                for (const file of fileArray) {
                    const imagePath = path.join(__dirname, file.path);
                    const outputFilePath = path.join(__dirname, "./public/temp", `resized-${Date.now()}-${file.filename}`);

                    const metadata = await sharp(imagePath).metadata();
                    const aspectRatio = metadata.width / metadata.height;

                    let newWidth = Math.min(1440, metadata.width);
                    let newHeight = Math.round(newWidth / aspectRatio);

                    if (newHeight > 1080) {
                        newHeight = 1080;
                        newWidth = Math.round(newHeight * aspectRatio);
                    }

                    // Resize the image
                    await sharp(imagePath)
                        .resize(newWidth, newHeight)
                        .toFormat("jpeg")
                        .jpeg({ quality: 70 })
                        .toFile(outputFilePath);

                    // Remove the original file
                    fs.unlinkSync(imagePath);
                    file.path = outputFilePath;
                    file.filename = `resized-${Date.now()}-${file.filename}`;
                }
            }

            next();
        } catch (err) {
            console.error("Error processing image:", err);
            return res.status(500).json(
                new ApiResponse(500, err.message, "Something went wrong while processing the images")
            );
        }
    } else {
        next();
    }
};
