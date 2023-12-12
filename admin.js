const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Set up MongoDB connection
mongoose.connect('mongodb+srv://Shashh_454 :shashwath454@your_cluster.mongodb.net/admin_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define MongoDB schema and model
const reportCardSchema = new mongoose.Schema({
  usn: String,
  phone_num: Number,
  image_path: String
});

const ReportCard = mongoose.model('ReportCard', reportCardSchema);

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Express route for handling file upload
app.post('/upload', upload.single('image'), async (req, res) => {
  const usn = req.body.usn;
  const phone_num = req.body.phone_num;
  const imageBuffer = req.file.buffer;

  // Insert data into MongoDB
  const reportCard = new ReportCard({
    usn: usn,
    phone_num: phone_num,
    image_path: Buffer.from(imageBuffer).toString('base64') // Convert image to base64 for storage
  });

  try {
    await reportCard.save();
    console.log('Report card uploaded successfully.');
    res.send('Report card uploaded successfully.');
  } catch (error) {
    console.error('Error inserting data into MongoDB: ' + error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
