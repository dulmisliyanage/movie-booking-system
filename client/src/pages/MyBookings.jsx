import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../services/bookingService';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await bookingService.getMyBookings();
                setBookings(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to load your bookings');
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-darkBg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-darkBg text-white pb-20 font-inter">
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-5xl md:text-7xl font-bebas text-white tracking-wider uppercase">
                        MY <span className="text-primary">BOOKINGS</span> 🎟
                    </h1>
                    <div className="h-1.5 w-24 bg-primary rounded-full hidden md:block shadow-[0_0_15px_rgba(177,18,38,0.5)]"></div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 px-6 py-4 rounded-lg mb-8 inline-block">
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="bg-[#1C1C1C] rounded-2xl p-20 text-center border border-slate-800 shadow-xl">
                        <div className="text-6xl mb-6">🍿</div>
                        <h2 className="text-2xl font-bold mb-4">No bookings found yet</h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            You haven't booked any movies yet. Ready to experience something big?
                        </p>
                        <Link
                            to="/movies"
                            className="inline-block bg-[#B11226] hover:bg-[#E50914] text-white font-bold px-8 py-3 rounded-xl transition duration-300"
                        >
                            Browse Now Showing
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-[#1C1C1C] rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition duration-300 shadow-lg group"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Movie Poster */}
                                    <div className="md:w-48 h-64 md:h-auto overflow-hidden relative">
                                        <img
                                            src={booking.movieId.poster}
                                            alt={booking.movieId.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${booking.status === 'confirmed'
                                            ? 'bg-green-600/20 text-green-500 border-green-500/30'
                                            : 'bg-slate-900/40 text-slate-400 border-slate-700'
                                            }`}>
                                            {booking.status}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-8 flex flex-col justify-between">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {/* Column 1: Movie Info */}
                                            <div>
                                                <h2 className="text-2xl font-bold mb-2 group-hover:text-red-500 transition">{booking.movieId.title}</h2>
                                                <div className="flex items-center space-x-2 text-slate-400 text-sm italic">
                                                    <span>{booking.movieId.genre}</span>
                                                    <span>•</span>
                                                    <span>{booking.movieId.duration} min</span>
                                                </div>
                                            </div>

                                            {/* Column 2: Showtime Details */}
                                            <div className="space-y-3">
                                                <div className="flex items-start">
                                                    <span className="w-20 text-slate-500 text-xs font-bold uppercase mt-1">Date</span>
                                                    <span className="font-semibold">{new Date(booking.showtimeId.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="w-20 text-slate-500 text-xs font-bold uppercase mt-1">Time</span>
                                                    <span className="text-red-500 font-bold">{booking.showtimeId.time}</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="w-20 text-slate-500 text-xs font-bold uppercase mt-1">Hall</span>
                                                    <span>{booking.showtimeId.hall}</span>
                                                </div>
                                            </div>

                                            {/* Column 3: Seats & Price */}
                                            <div className="space-y-3 md:text-right">
                                                <div className="md:inline-block">
                                                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Seats</div>
                                                    <div className="text-xl font-bold text-white">{booking.seatsSelected.join(', ')}</div>
                                                </div>
                                                <div className="md:block">
                                                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Total Paid</div>
                                                    <div className="text-2xl font-black text-red-500">LKR {booking.totalPrice.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                                            <div className="text-slate-500 text-xs font-mono">
                                                BOOKING ID: <span className="text-slate-400">{booking._id}</span>
                                            </div>
                                            <div className="text-slate-500 text-xs">
                                                Booked on: {new Date(booking.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBookings;
