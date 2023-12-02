const express = require('express');
const cors = require('cors'); // Import the cors module
const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: 'http://localhost:3001', // Define the allowed origin for CORS
};

app.use(cors(corsOptions));

app.get('/analyze-image', async (req, res) => {
  const imageUrl = req.query.url; // Extract the image URL from the query parameter

  if (!imageUrl) {
    // Check if the image URL is provided in the request
    return res.status(400).send('No image URL provided'); // Respond with a 400 Bad Request if not provided
  }

  try {
    // Use dynamic import to fetch the image using node-fetch
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(imageUrl); // Fetch the image data from the provided URL

    if (!response.ok) {
      // Check if the image fetch was successful (HTTP status 200)
      throw new Error('Failed to fetch image'); // If not, throw an error
    }

    const contentType = response.headers.get('content-type'); // Get the content-type header
    const contentLength = response.headers.get('content-length'); // Get the content-length header

    res.json({
      fileType: contentType, // Respond with the content type (image format)
      fileSize: contentLength, // Respond with the content length (image size in bytes)
    });
  } catch (error) {
    console.error('Error fetching image:', error); // Log any errors that occur during image fetching
    res.status(500).send('Error processing image'); // Respond with a 500 Internal Server Error
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
