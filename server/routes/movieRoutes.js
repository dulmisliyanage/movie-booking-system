const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/movies
// @desc    Get all movies
// @access  Public
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find({}).sort({ createdAt: -1 });
        res.json(movies);
    } catch (error) {
        console.error('Get movies error:', error);
        res.status(500).json({ message: 'Server error fetching movies' });
    }
});

// @route   GET /api/movies/:id
// @desc    Get single movie by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        console.error('Get movie error:', error);
        res.status(500).json({ message: 'Server error fetching movie' });
    }
});

// @route   POST /api/movies
// @desc    Create a new movie
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { title, description, genre, duration, rating, releaseDate, poster, showtimes } = req.body;

        const movie = await Movie.create({
            title,
            description,
            genre,
            duration,
            rating,
            releaseDate,
            poster,
            showtimes
        });

        res.status(201).json(movie);
    } catch (error) {
        console.error('Create movie error:', error);
        res.status(500).json({ message: 'Server error creating movie' });
    }
});

// @route   PUT /api/movies/:id
// @desc    Update a movie
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (movie) {
            movie.title = req.body.title || movie.title;
            movie.description = req.body.description || movie.description;
            movie.genre = req.body.genre || movie.genre;
            movie.duration = req.body.duration || movie.duration;
            movie.rating = req.body.rating || movie.rating;
            movie.releaseDate = req.body.releaseDate || movie.releaseDate;
            movie.poster = req.body.poster || movie.poster;
            movie.showtimes = req.body.showtimes || movie.showtimes;

            const updatedMovie = await movie.save();
            res.json(updatedMovie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        console.error('Update movie error:', error);
        res.status(500).json({ message: 'Server error updating movie' });
    }
});

// @route   DELETE /api/movies/:id
// @desc    Delete a movie
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (movie) {
            await movie.deleteOne();
            res.json({ message: 'Movie removed' });
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        console.error('Delete movie error:', error);
        res.status(500).json({ message: 'Server error deleting movie' });
    }
});

module.exports = router;
