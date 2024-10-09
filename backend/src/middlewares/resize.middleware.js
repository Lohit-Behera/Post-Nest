import sharp from "sharp";
import path from "path";
import fs from "fs";
import { ApiResponse } from "../utils/ApiResponse.js";

sharp.cache(false);
const __dirname = path.resolve();

export const resizeImage = async (req, res, next) => {
    const files = req.files || (req.file ? { image: [req.file] } : null);

    if (files) {
        try {
            const fileFields = Object.keys(files);

            for (const fieldName of fileFields) {
                const fileArray = files[fieldName];

                for (const file of fileArray) {
                    const originalName = file.originalname;
                    const metadata = await sharp(file.buffer || file.path).metadata();
                    const aspectRatio = metadata.width / metadata.height;

                    let newWidth = Math.min(1440, metadata.width);
                    let newHeight = Math.round(newWidth / aspectRatio);

                    if (newHeight > 1080) {
                        newHeight = 1080;
                        newWidth = Math.round(newHeight * aspectRatio);
                    }

                    if (process.env.MEMORY === 'true') {
                        const resizedImageBuffer = await sharp(file.buffer)
                            .resize(newWidth, newHeight)
                            .toFormat("jpeg")
                            .jpeg({ quality: 70 })
                            .toBuffer();

                        file.buffer = resizedImageBuffer;
                        file.filename = `resized-${Date.now()}-${originalName}`;
                    }
                    else {
                        const imagePath = path.join(__dirname, file.path);
                        const outputFilePath = path.join(__dirname, "./public/temp", `resized-${Date.now()}-${file.filename}`);

                        await sharp(imagePath)
                            .resize(newWidth, newHeight)
                            .toFormat("jpeg")
                            .jpeg({ quality: 70 })
                            .toFile(outputFilePath);

                        fs.unlinkSync(imagePath);
                        file.path = outputFilePath;
                        file.filename = `resized-${Date.now()}-${file.filename}`;
                    }
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
