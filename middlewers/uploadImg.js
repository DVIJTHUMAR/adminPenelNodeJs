const multer = require('multer');

const storage = multer.diskStorage(
    {
        destination: (req, file, next) => {
            next(null, './myUploads');
        },
        filename: (req, file, next) => {
            const unicName = Date.now() + '--' + file.originalname;

            next(null, unicName);
        }
    }
);

const upload = multer({ storage });

module.exports = upload;