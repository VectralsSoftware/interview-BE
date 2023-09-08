const express = require('express')
const path = require('path');
const connectDB = require('./config/db')
const cors = require('cors')

// Initialize app
const app = express()
app.use(express.json({extended: false}))
app.use(cors())

// Connecting with DB
connectDB();

// Routes
app.use('/api/auth', require('./routes/api/auth'))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server listening on port ${PORT} 🔥`))