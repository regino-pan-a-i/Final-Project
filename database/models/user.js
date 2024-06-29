const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: false, default: 'user'},
    pastTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Travel', required: false}],
    futureTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Travel', required: false}],
    likedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Travel', required: false}],
});

const User = mongoose.model('User', userSchema);
module.exports = User;