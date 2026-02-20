import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import showtimeService from '../services/showtimeService';
import bookingService from '../services/bookingService';

function Booking() {
    const { showtimeId } = useParams();
    const navigate = useNavigate();

    const [showtime, setShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Seat configuration
    const rows = ['A', 'B', 'C', 'D'];
    const seatsPerRow = 8;

    useEffect(() => {
        const fetchShowtime = async () => {
            try {
                const data = await showtimeService.getShowtime(showtimeId);
                setShowtime(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching showtime:', err);
                setError('Failed to load showtime details');
                setLoading(false);
            }
        };

        fetchShowtime();
    }, [showtimeId]);

    const handleSeatClick = (seatId) => {
        if (showtime.bookedSeats.includes(seatId)) return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleConfirmBooking = async () => {
        if (selectedSeats.length === 0) return;

        try {
            setBookingLoading(true);
            const bookingData = {
                movieId: showtime.movieId._id,
                showtimeId: showtime._id,
                seatsSelected: selectedSeats
            };

            const response = await bookingService.createBooking(bookingData);

            // On success, redirect to success page
            navigate(`/booking-success/${response._id}`);
        } catch (err) {
            console.error('Booking error:', err);
            alert(err.response?.data?.message || 'Failed to confirm booking');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-darkBg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !showtime) {
        return (
            <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center p-4">
                <div className="bg-primary/10 border border-primary/50 text-red-400 px-6 py-4 rounded-lg mb-4">
                    {error || 'Showtime not found'}
                </div>
                <Link to="/movies" className="text-textMuted hover:text-white transition uppercase text-xs font-black tracking-widest font-inter">
                    &larr; Back to Movies
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-darkBg text-white pb-20 font-inter">
            <div className="container mx-auto px-4 py-12">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 bg-[#121212] p-8 rounded-2xl border border-slate-800/50 shadow-2xl">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bebas mb-2 tracking-wider uppercase">{showtime.movieId.title}</h1>
                        <div className="flex items-center space-x-4 text-slate-400 font-bold text-sm uppercase tracking-tight">
                            <span className="text-primary">{showtime.time}</span>
                            <span>•</span>
                            <span>{showtime.hall}</span>
                            <span>•</span>
                            <span>LKR {showtime.price.toLocaleString()} PER SEAT</span>
                        </div>
                    </div>
                    <div className="text-left md:text-right">
                        <div className="text-slate-400 text-sm uppercase tracking-wider mb-1">Date</div>
                        <div className="text-xl font-semibold">
                            {new Date(showtime.date).toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Screen Label */}
                    <div className="relative mb-20">
                        <div className="w-full h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
                        <p className="text-center text-slate-500 text-sm mt-4 uppercase tracking-[0.5em]">Screen This Way</p>
                    </div>

                    {/* Seat Grid */}
                    <div className="flex flex-col items-center space-y-4 mb-20">
                        {rows.map(row => (
                            <div key={row} className="flex items-center space-x-4">
                                <span className="w-8 text-center text-slate-500 font-bold">{row}</span>
                                <div className="flex space-x-3">
                                    {[...Array(seatsPerRow)].map((_, i) => {
                                        const seatId = `${row}${i + 1}`;
                                        const isBooked = showtime.bookedSeats.includes(seatId);
                                        const isSelected = selectedSeats.includes(seatId);

                                        return (
                                            <button
                                                key={seatId}
                                                disabled={isBooked}
                                                onClick={() => handleSeatClick(seatId)}
                                                className={`
                                                    w-8 h-8 md:w-10 md:h-10 rounded-t-lg transition-all duration-200
                                                    ${isBooked
                                                        ? 'bg-gray-900 cursor-not-allowed opacity-50'
                                                        : isSelected
                                                            ? 'bg-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.5)] scale-110'
                                                            : 'bg-gray-700 hover:bg-[#E50914] group'
                                                    }
                                                `}
                                                title={isBooked ? 'Already Booked' : seatId}
                                            >
                                                <span className={`text-[10px] hidden md:block ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                                    {i + 1}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <span className="w-8 text-center text-slate-500 font-bold">{row}</span>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-8 mb-12 py-6 border-y border-slate-800">
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gray-700 rounded-t-lg"></div>
                            <span className="text-sm text-slate-400">Available</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-[#E50914] rounded-t-lg"></div>
                            <span className="text-sm text-slate-400">Selected</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gray-900 rounded-t-lg opacity-50"></div>
                            <span className="text-sm text-slate-400">Booked</span>
                        </div>
                    </div>

                    {/* Footer / Summary */}
                    <div className="bg-[#1C1C1C] rounded-2xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <div className="text-slate-400 text-sm mb-2">
                                {selectedSeats.length > 0 ? (
                                    <>Selected Seats: <span className="text-white font-bold">{selectedSeats.join(', ')}</span></>
                                ) : (
                                    'No seats selected'
                                )}
                            </div>
                            <div className="text-3xl font-bold italic">
                                Total: <span className="text-red-500">LKR {(selectedSeats.length * showtime.price).toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmBooking}
                            disabled={selectedSeats.length === 0 || bookingLoading}
                            className={`
                                px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300
                                ${selectedSeats.length > 0 && !bookingLoading
                                    ? 'bg-[#B11226] hover:bg-[#E50914] transform hover:scale-105 shadow-xl shadow-red-900/20'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }
                            `}
                        >
                            {bookingLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                                    Processing...
                                </div>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Booking;
