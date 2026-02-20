import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';
import showtimeService from '../services/showtimeService';
import bookingService from '../services/bookingService';

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalShowtimes: 0,
        totalBookings: 0,
        totalRevenue: 0,
        recentBookings: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const [movies, showtimes, bookings] = await Promise.all([
                    movieService.getAllMovies(),
                    showtimeService.getAllShowtimes(),
                    bookingService.getAllBookings()
                ]);

                const revenue = bookings.reduce((sum, b) =>
                    b.status === 'confirmed' ? sum + b.totalPrice : sum, 0
                );

                setStats({
                    totalMovies: movies.length,
                    totalShowtimes: showtimes.length,
                    totalBookings: bookings.length,
                    totalRevenue: revenue,
                    recentBookings: bookings.slice(0, 5)
                });
                setError(null);
            } catch (err) {
                console.error('Error fetching admin stats:', err);
                setError('Failed to load dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Movies', value: stats.totalMovies, icon: '🎬', color: 'text-white' },
        { label: 'Showtimes', value: stats.totalShowtimes, icon: '🎟', color: 'text-white' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: '💺', color: 'text-white' },
        { label: 'Total Revenue', value: `LKR ${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'text-primary' },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-12 font-inter">
            <div className="container mx-auto">
                <header className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-bebas mb-2 tracking-wider uppercase">ADMIN <span className="text-primary">CONSOLE</span></h1>
                    <p className="text-textSecondary font-bold text-sm uppercase tracking-widest">System Overview & Management</p>
                </header>

                {error && (
                    <div className="bg-primary/10 border border-primary/50 text-primary px-6 py-4 rounded-xl mb-8 font-bold">
                        {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statCards.map((card, idx) => (
                        <div key={idx} className="bg-cardBg border border-slate-800/50 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 shadow-xl group">
                            <div className="flex justify-between items-start mb-4 text-3xl">
                                <span>{card.icon}</span>
                                <div className="h-10 w-1 bg-slate-800 rounded-full group-hover:bg-primary transition-colors"></div>
                            </div>
                            <h3 className="text-textSecondary text-xs font-black uppercase tracking-widest mb-1">{card.label}</h3>
                            <div className={`text-3xl font-black ${card.color}`}>{card.value}</div>
                        </div>
                    ))}
                </div>

                {/* Management Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Link to="/admin/movies" className="bg-secondaryBg border border-slate-800/50 rounded-2xl p-8 hover:bg-slate-900 transition flex flex-col items-center text-center group">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition">🎥</div>
                        <h2 className="text-xl font-black mb-2">Manage Movies</h2>
                        <p className="text-sm text-textSecondary font-medium">Add, edit, or delete movies from the catalog.</p>
                    </Link>
                    <Link to="/admin/showtimes" className="bg-secondaryBg border border-slate-800/50 rounded-2xl p-8 hover:bg-slate-900 transition flex flex-col items-center text-center group">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition">📅</div>
                        <h2 className="text-xl font-black mb-2">Manage Showtimes</h2>
                        <p className="text-sm text-textSecondary font-medium">Schedule screenings and set ticket prices.</p>
                    </Link>
                    <Link to="/admin/bookings" className="bg-secondaryBg border border-slate-800/50 rounded-2xl p-8 hover:bg-slate-900 transition flex flex-col items-center text-center group">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition">🧾</div>
                        <h2 className="text-xl font-black mb-2">User Bookings</h2>
                        <p className="text-sm text-textSecondary font-medium">View all customer transactions and status.</p>
                    </Link>
                </div>

                {/* Recent Bookings Table Preview */}
                <div className="bg-cardBg border border-slate-800/50 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-slate-800/50 flex justify-between items-center">
                        <h2 className="text-xl font-black tracking-tight uppercase">Recent <span className="text-primary">Bookings</span></h2>
                        <Link to="/admin/bookings" className="text-primary text-sm font-black hover:text-primaryHover transition">View All &rarr;</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#121212] text-textMuted text-[10px] uppercase font-black tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">User</th>
                                    <th className="px-8 py-4">Movie</th>
                                    <th className="px-8 py-4">Seats</th>
                                    <th className="px-8 py-4">Total</th>
                                    <th className="px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/30">
                                {stats.recentBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-900/50 transition">
                                        <td className="px-8 py-5">
                                            <div className="font-bold">{booking.userId?.username}</div>
                                            <div className="text-xs text-textMuted">{booking.userId?.email}</div>
                                        </td>
                                        <td className="px-8 py-5 font-medium">{booking.movieId?.title}</td>
                                        <td className="px-8 py-5 text-textSecondary font-mono">{booking.seatsSelected.join(', ')}</td>
                                        <td className="px-8 py-5 font-black text-primary">LKR {booking.totalPrice.toLocaleString()}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${booking.status === 'confirmed' ? 'bg-green-600/10 text-green-500 border border-green-500/20' : 'bg-red-600/10 text-red-500 border border-red-500/20'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {stats.recentBookings.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-12 text-center text-textSecondary font-medium">No bookings recorded yet.</td>
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

export default AdminDashboard;
