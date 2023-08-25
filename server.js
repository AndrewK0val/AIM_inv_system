const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Allow requests from http://localhost:3001
app.use(cors({ origin: 'http://localhost:3001' }));

// Handle POST requests to the /categories endpoint
app.post('/categories', express.json(), (req, res) => {
    // Retrieve the categories data from the request body
    const categories = req.body;
    console.log(categories);
  
    // Wrap the categories array in an object with a "categories" property
    const categoriesObject = { categories };
  
    // Save the categories data to a file named categories.json
    fs.writeFile('categories.json', JSON.stringify(categoriesObject), (err) => {
      if (err) {
        // If there was an error saving the file, send a 500 status code and an error message
        console.error('Error saving categories to file:', err);
        res.status(500).send('Error saving categories to file');
      } else {
        // If the file was saved successfully, send a success message
        console.log('Categories saved to categories.json');
        res.send('Categories saved to categories.json');
      }
    });
  });

// Handle GET requests to the /categories endpoint
app.get('/categories', (req, res) => {
  // Read the categories data from the categories.json file
  fs.readFile('categories.json', (err, data) => {
    if (err) {
      // If there was an error reading the file, send a 500 status code and an error message
      console.error('Error reading categories from file:', err);
      res.status(500).send('Error reading categories from file');
    } else {
      // If the file was read successfully, parse the JSON data and wrap it in an object with a "categories" property
      const categories = JSON.parse(data);
      const categoriesObject = { categories };
      res.json(categoriesObject);
    }
  });
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});