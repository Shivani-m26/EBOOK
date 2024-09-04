const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ebookLandingPage', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema for form submissions
const formSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const Form = mongoose.model('Form', formSchema);

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submission
app.post('/submit-form', (req, res) => {
    const { name, email } = req.body;

    // Save form data to MongoDB
    const newForm = new Form({ name, email });
    newForm.save((err) => {
        if (err) {
            console.error('Error saving form data:', err);
            res.status(500).send('Internal server error');
        } else {
            console.log(`Form submitted: Name - ${name}, Email - ${email}`);
            res.send('Form submitted successfully!');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
