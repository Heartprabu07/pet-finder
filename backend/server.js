const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const petRoutes = require('./routes/pet.routes');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
// Increase JSON & URL-encoded payload limit
app.use(bodyParser.json({ limit: '50mb' }));  // Increase JSON request size
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Increase form data size


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
