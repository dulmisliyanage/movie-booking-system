const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    hall: {
        type: String,
        required: true,
        default: 'Hall A'
    },
    price: {
        type: Number,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true,
        default: 100
    },
    bookedSeats: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual field to get available seats count
showtimeSchema.virtual('availableSeats').get(function () {
    if (!this.bookedSeats || this.totalSeats === undefined) return null;
    return this.totalSeats - this.bookedSeats.length;
});

// Method to check if seats are available
showtimeSchema.methods.areSeatsAvailable = function (seats) {
    if (!this.bookedSeats) return true;
    return seats.every(seat => !this.bookedSeats.includes(seat));
};

// Method to book seats
showtimeSchema.methods.bookSeats = function (seats) {
    if (!this.areSeatsAvailable(seats)) {
        throw new Error('One or more seats are already booked');
    }
    this.bookedSeats.push(...seats);
    return this.save();
};

// Ensure virtuals are included in JSON
showtimeSchema.set('toJSON', { virtuals: true });
showtimeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Showtime', showtimeSchema);
