import multer from "multer";
import path from "path";

// Conditionally switch between memory and disk storage
const storage = process.env.MEMORY === 'true' 
    ? multer.memoryStorage() 
    : multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, "./public/temp"));
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        },
    });

export const upload = multer({ storage: storage });
