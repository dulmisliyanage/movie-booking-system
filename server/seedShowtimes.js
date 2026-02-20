const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');

dotenv.config();

const seedShowtimes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const movies = await Movie.find({});
        if (movies.length === 0) {
            console.log('No movies found. Please seed movies first.');
            process.exit(1);
        }

        await Showtime.deleteMany({});
        console.log('Cleared existing showtimes');

        const halls = ['Hall A', 'Hall B', 'VIP Hall'];
        const times = ['10:00 AM', '01:30 PM', '04:00 PM', '07:30 PM', '10:15 PM'];
        const prices = [1000, 1200, 1500, 2500];

        const showtimes = [];

        // Today and Tomorrow
        const dates = [new Date(), new Date()];
        dates[1].setDate(dates[1].getDate() + 1);

        movies.forEach(movie => {
            dates.forEach((date, dateIdx) => {
                // Each movie gets 3 showtimes per day
                for (let i = 0; i < 3; i++) {
                    const time = times[(i + dateIdx) % times.length];
                    const hall = halls[i % halls.length];
                    const price = prices[i % prices.length];

                    showtimes.push({
                        movieId: movie._id,
                        date: new Date(date.setHours(0, 0, 0, 0)),
                        time,
                        hall,
                        price,
                        totalSeats: hall === 'VIP Hall' ? 30 : 100,
                        bookedSeats: []
                    });
                }
            });
        });

        await Showtime.insertMany(showtimes);
        console.log(`Seeded ${showtimes.length} showtimes successfully`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding showtimes:', error);
        process.exit(1);
    }
};

seedShowtimes();
