const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        if (file.fieldname === 'file') {
            return {
                folder: 'elibrary/books',
                resource_type: "raw",
                format: "pdf",
                access_mode:"public"
            };
        } else if (file.fieldname === 'coverImage') {
            return {
                folder: "elibrary/covers",
                resource_type: "image",
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
            }
        }
    }
});

const upload = multer({ storage });

module.exports = upload;