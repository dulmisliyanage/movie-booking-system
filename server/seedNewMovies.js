const mongoose = require('mongoose');
const Movie = require('./models/Movie');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking';

const newMovies = [
    {
        title: "Neon Nights",
        description: "In a rain-soaked metropolis controlled by powerful mega-corporations, a rogue data-hacker discovers a truth that will ignite a revolution.",
        genre: "Sci-Fi / Action",
        duration: 124,
        rating: 8.7,
        releaseDate: new Date('2026-03-15'),
        poster: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
        showtimes: [
            { time: "7:00 PM", availableSeats: 100, price: 1500 },
            { time: "10:30 PM", availableSeats: 100, price: 1200 }
        ]
    },
    {
        title: "Shadow of the Colossus",
        description: "An ancient warrior embarks on a forbidden journey to awaken a lost soul, but his path is guarded by titans older than memory.",
        genre: "Fantasy / Adventure",
        duration: 142,
        rating: 9.1,
        releaseDate: new Date('2026-04-02'),
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1968&auto=format&fit=crop",
        showtimes: [
            { time: "6:00 PM", availableSeats: 100, price: 1800 },
            { time: "9:30 PM", availableSeats: 100, price: 1800 }
        ]
    },
    {
        title: "Whispers in the Wind",
        description: "A small coastal town's secrets begin to unravel when long-lost letters start appearing on the doorsteps of those who forgot the past.",
        genre: "Mystery / Drama",
        duration: 118,
        rating: 8.2,
        releaseDate: new Date('2026-05-20'),
        poster: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2070&auto=format&fit=crop",
        showtimes: [
            { time: "5:30 PM", availableSeats: 100, price: 1200 },
            { time: "8:45 PM", availableSeats: 100, price: 1200 }
        ]
    }
];

const seedNewMovies = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        for (const movieData of newMovies) {
            const exists = await Movie.findOne({ title: movieData.title });
            if (!exists) {
                await Movie.create(movieData);
                console.log(`Added movie: ${movieData.title}`);
            } else {
                console.log(`Movie already exists: ${movieData.title}`);
            }
        }

        console.log('Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedNewMovies();
