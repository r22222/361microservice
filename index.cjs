'use strict';
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const Jimp = require('jimp');

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all routes
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Image upload and stats
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/process-image', upload.single('image'), async (req, res) => {
  try {
      const image = req.file;
      console.log('Received image:', image); // Line for debugging
      const jimpImage = await Jimp.read(image.buffer);

      // Extract image statistics
      const fileName = image.originalname;
      const fileType = image.mimetype;
      const fileSize = image.size;

      // Prepare the response
      const response = {
          fileName,
          fileType,
          fileSize,
          // Other image statistics you want to include
      };

      // Send the response back to the client
      res.json(response);
  } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).send('Error processing image');
  }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
