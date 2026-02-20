const express = require('express');
const router = express.Router();
const Showtime = require('../models/Showtime');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/showtimes
// @desc    Get all showtimes (optionally filter by movieId)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { movieId } = req.query;

        const filter = movieId ? { movieId } : {};
        const showtimes = await Showtime.find(filter)
            .populate('movieId', 'title poster duration genre')
            .sort({ date: 1, time: 1 });

        res.json(showtimes);
    } catch (error) {
        console.error('Get showtimes error:', error);
        res.status(500).json({ message: 'Server error fetching showtimes' });
    }
});

// @route   GET /api/showtimes/:id
// @desc    Get single showtime by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id)
            .populate('movieId', 'title poster duration genre rating');

        if (showtime) {
            res.json(showtime);
        } else {
            res.status(404).json({ message: 'Showtime not found' });
        }
    } catch (error) {
        console.error('Get showtime error:', error);
        res.status(500).json({ message: 'Server error fetching showtime' });
    }
});

// @route   POST /api/showtimes
// @desc    Create a new showtime
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { movieId, date, time, hall, price, totalSeats } = req.body;

        const showtime = await Showtime.create({
            movieId,
            date,
            time,
            hall,
            price,
            totalSeats: totalSeats || 100
        });

        const populatedShowtime = await Showtime.findById(showtime._id)
            .populate('movieId', 'title poster');

        res.status(201).json(populatedShowtime);
    } catch (error) {
        console.error('Create showtime error:', error);
        res.status(500).json({ message: 'Server error creating showtime' });
    }
});

// @route   PUT /api/showtimes/:id
// @desc    Update a showtime
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id);

        if (showtime) {
            showtime.date = req.body.date || showtime.date;
            showtime.time = req.body.time || showtime.time;
            showtime.hall = req.body.hall || showtime.hall;
            showtime.price = req.body.price || showtime.price;
            showtime.totalSeats = req.body.totalSeats || showtime.totalSeats;

            const updatedShowtime = await showtime.save();
            const populatedShowtime = await Showtime.findById(updatedShowtime._id)
                .populate('movieId', 'title poster');

            res.json(populatedShowtime);
        } else {
            res.status(404).json({ message: 'Showtime not found' });
        }
    } catch (error) {
        console.error('Update showtime error:', error);
        res.status(500).json({ message: 'Server error updating showtime' });
    }
});

// @route   DELETE /api/showtimes/:id
// @desc    Delete a showtime
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id);

        if (showtime) {
            await showtime.deleteOne();
            res.json({ message: 'Showtime removed' });
        } else {
            res.status(404).json({ message: 'Showtime not found' });
        }
    } catch (error) {
        console.error('Delete showtime error:', error);
        res.status(500).json({ message: 'Server error deleting showtime' });
    }
});

module.exports = router;
