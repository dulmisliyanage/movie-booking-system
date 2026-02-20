import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import bookingService from '../services/bookingService';

function BookingSuccess() {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const data = await bookingService.getBooking(bookingId);
                setBooking(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching booking details:', err);
                setError('Failed to load booking details');
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-darkBg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center p-4">
                <div className="bg-primary/10 border border-primary/50 text-red-400 px-6 py-4 rounded-lg mb-4">
                    {error || 'Booking not found'}
                </div>
                <Link to="/movies" className="text-textMuted hover:text-white transition uppercase text-xs font-black tracking-widest">
                    &larr; Back to Movies
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-darkBg text-white flex items-center justify-center py-12 px-4 font-inter">
            <div className="max-w-2xl w-full bg-[#121212] rounded-3xl border border-slate-800/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                {/* Success Header */}
                <div className="bg-green-600/5 border-b border-green-600/10 p-10 text-center">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(22,163,74,0.3)]">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bebas text-white mb-2 tracking-wider">BOOKING <span className="text-green-500">CONFIRMED!</span></h1>
                    <p className="text-slate-500 font-medium">Your tickets are ready. Enjoy the show!</p>
                </div>

                <div className="p-10">
                    {/* Movie Details */}
                    <div className="flex gap-6 mb-10 pb-10 border-b border-slate-800">
                        <img
                            src={booking.movieId.poster}
                            alt={booking.movieId.title}
                            className="w-24 h-36 object-cover rounded-lg shadow-lg border border-slate-700"
                        />
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{booking.movieId.title}</h2>
                            <div className="space-y-1 text-slate-400">
                                <p className="flex items-center">
                                    <span className="w-24 font-medium text-slate-500 uppercase text-xs tracking-wider">Hall</span>
                                    <span className="text-white font-semibold">{booking.showtimeId.hall}</span>
                                </p>
                                <p className="flex items-center">
                                    <span className="w-24 font-medium text-slate-500 uppercase text-xs tracking-wider">Time</span>
                                    <span className="text-red-500 font-bold">{booking.showtimeId.time}</span>
                                </p>
                                <p className="flex items-center">
                                    <span className="w-24 font-medium text-slate-500 uppercase text-xs tracking-wider">Date</span>
                                    <span className="text-white font-semibold">
                                        {new Date(booking.showtimeId.date).toLocaleDateString(undefined, {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="bg-[#1C1C1C]/50 p-6 rounded-2xl border border-slate-800/50">
                            <p className="text-textMuted text-[10px] uppercase font-black tracking-widest mb-1">Selected Seats</p>
                            <p className="text-2xl font-black text-white">{booking.seatsSelected.join(', ')}</p>
                        </div>
                        <div className="bg-[#1C1C1C]/50 p-6 rounded-2xl border border-slate-800/50">
                            <p className="text-textMuted text-[10px] uppercase font-black tracking-widest mb-1">Total Paid</p>
                            <p className="text-2xl font-black text-primary">LKR {booking.totalPrice.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <p className="text-textMuted text-[10px] uppercase tracking-widest mb-1 font-black">Booking ID</p>
                        <p className="text-slate-500 font-mono text-sm">{booking._id}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            to="/my-bookings"
                            className="bg-primary hover:bg-primaryHover text-white font-black py-4 rounded-xl transition duration-300 text-center shadow-xl shadow-red-900/20 uppercase tracking-widest text-sm"
                        >
                            View Bookings
                        </Link>
                        <Link
                            to="/movies"
                            className="bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-xl transition duration-300 text-center uppercase tracking-widest text-sm"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingSuccess;
