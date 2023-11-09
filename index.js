// Loads the express module
const express = require('express');

// Loads the multer module
const multer = require('multer');

// Loads the path module
const path = require('path');

// Loads FS module
const fs = require('fs');

// Creates our express server
const app = express();

const port = 4000;

// Serves static files (we need it to import .css, .js and image files)
app.use(express.static('public'));

// Serves upload images
app.use(express.static('uploads'));

//Sets a basic route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Set multer storage option
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/'

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        cb(null, dir)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)

        //cb(null, Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        req.errorMessage = 'Please upload a .png, .jpg, .jpeg image'
        cb(null, false)
    }
}

// Set multer upload object
const upload = multer({ storage, fileFilter })

// Set post upload route
app.post('/upload', upload.single('image'), (req, res) => {
    if (req.errorMessage) {
        return res.status(422).json({
            success: false,
            message: req.errorMessage
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Image uploaded successfully'
    })
});

// Makes the app listen to port 4000
app.listen(port, () => console.log(`Server started on port ${port}`));


