const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { movieId, showtimeId, seatsSelected } = req.body;

        // Validate input
        if (!movieId || !showtimeId || !seatsSelected || seatsSelected.length === 0) {
            return res.status(400).json({
                message: 'Please provide movieId, showtimeId, and at least one seat'
            });
        }

        // Get showtime and check seat availability
        const showtime = await Showtime.findById(showtimeId);

        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }

        // Check if seats are available (prevent double booking)
        const unavailableSeats = seatsSelected.filter(seat =>
            showtime.bookedSeats.includes(seat)
        );

        if (unavailableSeats.length > 0) {
            return res.status(400).json({
                message: 'Some seats are already booked',
                unavailableSeats
            });
        }

        // Calculate total price
        const totalPrice = showtime.price * seatsSelected.length;

        // Create booking
        const booking = await Booking.create({
            userId: req.user._id,
            movieId,
            showtimeId,
            seatsSelected,
            totalPrice
        });

        // Update showtime with booked seats
        await showtime.bookSeats(seatsSelected);

        // Populate booking details
        const populatedBooking = await Booking.findById(booking._id)
            .populate('movieId', 'title poster genre')
            .populate('showtimeId', 'date time hall price')
            .populate('userId', 'username email');

        res.status(201).json(populatedBooking);
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: error.message || 'Server error creating booking' });
    }
});

// @route   GET /api/bookings/my
// @desc    Get current user's bookings
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('movieId', 'title poster genre duration')
            .populate('showtimeId', 'date time hall price')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
});

// @route   GET /api/bookings
// @desc    Get all bookings (admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('userId', 'username email')
            .populate('movieId', 'title poster')
            .populate('showtimeId', 'date time hall')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('movieId', 'title poster genre duration rating')
            .populate('showtimeId', 'date time hall price')
            .populate('userId', 'username email');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns this booking or is admin
        if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ message: 'Server error fetching booking' });
    }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns this booking or is admin
        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        // Check if already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        // Remove seats from showtime's booked seats
        const showtime = await Showtime.findById(booking.showtimeId);
        if (showtime) {
            showtime.bookedSeats = showtime.bookedSeats.filter(
                seat => !booking.seatsSelected.includes(seat)
            );
            await showtime.save();
        }

        const populatedBooking = await Booking.findById(booking._id)
            .populate('movieId', 'title poster')
            .populate('showtimeId', 'date time hall')
            .populate('userId', 'username email');

        res.json(populatedBooking);
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ message: 'Server error cancelling booking' });
    }
});

module.exports = router;
