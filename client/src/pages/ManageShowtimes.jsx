import { useState, useEffect } from 'react';
import showtimeService from '../services/showtimeService';
import movieService from '../services/movieService';

function ManageShowtimes() {
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        movieId: '',
        date: '',
        time: '',
        hall: '',
        price: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [showtimesData, moviesData] = await Promise.all([
                showtimeService.getAllShowtimes(),
                movieService.getAllMovies()
            ]);
            setShowtimes(showtimesData);
            setMovies(moviesData);
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load showtimes or movies.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await showtimeService.createShowtime(formData);
            setFormData({
                movieId: '',
                date: '',
                time: '',
                hall: '',
                price: ''
            });
            fetchData();
        } catch (err) {
            console.error('Error creating showtime:', err);
            alert('Error creating showtime. Check console.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this showtime? All associated bookings might be affected.')) {
            try {
                await showtimeService.deleteShowtime(id);
                fetchData();
            } catch (err) {
                console.error('Error deleting showtime:', err);
                alert('Error deleting showtime.');
            }
        }
    };

    if (loading && showtimes.length === 0) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-12 font-inter">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Add Showtime Section */}
                    <div className="lg:w-1/3">
                        <div className="bg-cardBg border border-slate-800/50 rounded-2xl p-8 sticky top-24 shadow-2xl">
                            <h2 className="text-3xl font-bebas mb-6 uppercase tracking-wider">
                                Create <span className="text-primary">Showtime</span>
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Select Movie</label>
                                    <select
                                        name="movieId"
                                        value={formData.movieId}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#121212] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition appearance-none"
                                        required
                                    >
                                        <option value="">Choose a movie...</option>
                                        {movies.map(movie => (
                                            <option key={movie._id} value={movie._id}>{movie.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#121212] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Time (e.g. 7:00 PM)</label>
                                        <input
                                            type="text"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#121212] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                                            placeholder="7:00 PM"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Hall Name</label>
                                        <input
                                            type="text"
                                            name="hall"
                                            value={formData.hall}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#121212] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                                            placeholder="Hall A"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Ticket Price (LKR)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#121212] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primaryHover text-white font-black py-4 rounded-xl transition duration-300 transform active:scale-95 shadow-xl shadow-red-900/10"
                                    >
                                        Schedule Showtime
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Showtime List Section */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-4xl font-bebas uppercase tracking-wider">Screening <span className="text-primary">Schedule</span></h1>
                            <div className="text-textMuted text-sm font-bold">{showtimes.length} Slots Scheduled</div>
                        </div>

                        {error && <div className="text-red-500 mb-4 font-bold">{error}</div>}

                        <div className="bg-cardBg border border-slate-800/50 rounded-2xl overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead className="bg-[#121212] text-textMuted text-[10px] uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">Movie & Hall</th>
                                        <th className="px-8 py-5">Date / Time</th>
                                        <th className="px-8 py-5">Price</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/30">
                                    {showtimes.map((showtime) => (
                                        <tr key={showtime._id} className="hover:bg-slate-900/30 transition group">
                                            <td className="px-8 py-6">
                                                <div className="font-black text-white group-hover:text-primary transition">{showtime.movieId?.title}</div>
                                                <div className="text-textMuted text-xs font-bold mt-1 uppercase tracking-tighter">{showtime.hall}</div>
                                            </td>
                                            <td className="px-8 py-6 text-sm">
                                                <div className="text-white font-medium">{new Date(showtime.date).toLocaleDateString()}</div>
                                                <div className="text-primary font-black mt-0.5">{showtime.time}</div>
                                            </td>
                                            <td className="px-8 py-6 font-black text-white">
                                                LKR {showtime.price.toLocaleString()}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => handleDelete(showtime._id)}
                                                    className="p-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition"
                                                    title="Remove Slot"
                                                >
                                                    🗑
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {showtimes.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-16 text-center text-textSecondary font-medium">No showtimes scheduled.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageShowtimes;
