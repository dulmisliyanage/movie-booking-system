import { useState, useEffect } from 'react';
import bookingService from '../services/bookingService';

function ManageBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getAllBookings();
            setBookings(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load system bookings.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking? This action is permanent.')) {
            try {
                await bookingService.cancelBooking(id);
                fetchBookings();
            } catch (err) {
                console.error('Error cancelling booking:', err);
                alert('Error cancelling booking.');
            }
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.userId?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.movieId?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b._id.includes(searchTerm)
    );

    if (loading && bookings.length === 0) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-12 font-inter">
            <div className="container mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-bebas mb-2 uppercase tracking-wider">System <span className="text-primary">Bookings</span></h1>
                        <p className="text-textSecondary font-bold text-sm uppercase tracking-widest">All customer transactions and reservations</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by User, Movie, or Booking ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-cardBg border border-slate-800/50 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-primary outline-none transition shadow-lg"
                        />
                    </div>
                </header>

                {error && <div className="text-red-500 mb-4 font-bold">{error}</div>}

                <div className="bg-cardBg border border-slate-800/50 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#121212] text-textMuted text-[10px] uppercase font-black tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Details</th>
                                    <th className="px-8 py-5">Customer</th>
                                    <th className="px-8 py-5">Seats / Location</th>
                                    <th className="px-8 py-5">Total Paid</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/30">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-900/30 transition group">
                                        <td className="px-8 py-6">
                                            <div className="font-black text-white group-hover:text-primary transition">{booking.movieId?.title}</div>
                                            <div className="text-[10px] text-textMuted font-mono mt-1 uppercase">ID: {booking._id}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-white">{booking.userId?.username}</div>
                                            <div className="text-xs text-textSecondary">{booking.userId?.email}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-white font-medium">{booking.seatsSelected.join(', ')}</div>
                                            <div className="text-[10px] text-textMuted font-black uppercase tracking-widest mt-1">
                                                {booking.showtimeId?.hall} • {booking.showtimeId?.time}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-black text-white">
                                            LKR {booking.totalPrice.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${booking.status === 'confirmed' ? 'bg-green-600/10 text-green-500 border border-green-500/20' : 'bg-red-600/10 text-red-500 border border-red-500/20'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 rounded-lg transition"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredBookings.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-16 text-center text-textSecondary font-medium">No bookings found matching your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageBookings;
