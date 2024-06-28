const mongoose = require('mongoose');
const env = require('dotenv').config();
 
async function connectToDatabase() {
    const uri = process.env.MONGODB_URL;
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
 
module.exports = { connectToDatabase };