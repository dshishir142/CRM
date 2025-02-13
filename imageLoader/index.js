const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Set the uploads directory path
const uploadsDir = path.join(__dirname, 'uploads');
const PORT = 8001;

// Ensure that the 'uploads' directory exists, create it if it doesn't
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Save the file in the 'uploads' directory
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate a unique name for the file using the current timestamp
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

app.use('/image', express.static(uploadsDir));

// Handle the file upload route
app.post('/upload', upload.single('image'), (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate the image URL
    const imgUrl = `http://localhost:${PORT}/image/${req.file.filename}`;

    // Send back the success response with the image URL
    res.json({
        message: 'Uploaded successfully',
        imgUrl,
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
