const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true,
        default: 100
    },
    price: {
        type: Number,
        required: true
    }
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true // in minutes
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    releaseDate: {
        type: Date,
        required: true
    },
    poster: {
        type: String,
        default: ''
    },
    showtimes: [showtimeSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Movie', movieSchema);
