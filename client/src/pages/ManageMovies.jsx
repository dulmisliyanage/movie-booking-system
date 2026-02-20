import { useState, useEffect } from 'react';
import movieService from '../services/movieService';

function ManageMovies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMovieId, setCurrentMovieId] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        poster: '',
        genre: '',
        duration: '',
        releaseDate: '',
        rating: 5
    });

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const data = await movieService.getAllMovies();
            setMovies(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching movies:', err);
            setError('Failed to load movies.');
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
            if (isEditing) {
                await movieService.updateMovie(currentMovieId, formData);
            } else {
                await movieService.createMovie(formData);
            }
            // Reset and refresh
            resetForm();
            fetchMovies();
        } catch (err) {
            console.error('Error saving movie:', err);
            alert('Error saving movie. Check console.');
        }
    };

    const handleEdit = (movie) => {
        setFormData({
            title: movie.title,
            description: movie.description,
            poster: movie.poster,
            genre: movie.genre,
            duration: movie.duration,
            releaseDate: movie.releaseDate.split('T')[0], // Format date for input
            rating: movie.rating
        });
        setCurrentMovieId(movie._id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            try {
                await movieService.deleteMovie(id);
                fetchMovies();
            } catch (err) {
                console.error('Error deleting movie:', err);
                alert('Error deleting movie.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            poster: '',
            genre: '',
            duration: '',
            releaseDate: '',
            rating: 5
        });
        setIsEditing(false);
        setCurrentMovieId(null);
    };

    if (loading && movies.length === 0) {
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
                    {/* Add/Edit Form Section */}
                    <div className="lg:w-1/3">
                        <div className="bg-cardBg border border-slate-800/50 rounded-2xl p-8 sticky top-24 shadow-2xl">
                            <h2 className="text-3xl font-bebas mb-6 uppercase tracking-wider">
                                {isEditing ? 'Edit' : 'Add New'} <span className="text-primary">Movie</span>
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#121212] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Genre</label>
                                        <input
                                            type="text"
                                            name="genre"
                                            value={formData.genre}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#121212] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Duration (min)</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#121212] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Poster URL</label>
                                    <input
                                        type="text"
                                        name="poster"
                                        value={formData.poster}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#121212] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                                        placeholder="https://..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Release Date</label>
                                    <input
                                        type="date"
                                        name="releaseDate"
                                        value={formData.releaseDate}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#121212] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Rating</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        step="0.1"
                                        min="1"
                                        max="10"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#121212] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#121212] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition h-24 resize-none"
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary hover:bg-primaryHover text-white font-black py-4 rounded-xl transition duration-300 transform active:scale-95 shadow-xl shadow-red-900/10"
                                    >
                                        {isEditing ? 'Update Movie' : 'Add Movie'}
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="bg-slate-800 hover:bg-slate-700 text-white font-black px-6 rounded-xl transition"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Movie List Section */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-4xl font-bebas uppercase tracking-wider">Movie <span className="text-primary">Inventory</span></h1>
                            <div className="text-textMuted text-sm font-bold">{movies.length} Films Loaded</div>
                        </div>

                        {error && <div className="text-red-500 mb-4 font-bold">{error}</div>}

                        <div className="bg-cardBg border border-slate-800/50 rounded-2xl overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead className="bg-[#121212] text-textMuted text-[10px] uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">Movie Details</th>
                                        <th className="px-8 py-5">Genre / Time</th>
                                        <th className="px-8 py-5">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/30">
                                    {movies.map((movie) => (
                                        <tr key={movie._id} className="hover:bg-slate-900/30 transition group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={movie.poster}
                                                        alt={movie.title}
                                                        className="w-12 h-16 object-cover rounded shadow-md group-hover:scale-110 transition duration-300"
                                                    />
                                                    <div>
                                                        <div className="font-black text-white group-hover:text-primary transition">{movie.title}</div>
                                                        <div className="text-textMuted text-xs flex items-center mt-1">
                                                            <span className="text-yellow-500 mr-1">★</span> {movie.rating}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm">
                                                <div className="text-white font-bold">{movie.genre}</div>
                                                <div className="text-textSecondary text-xs">{movie.duration} min</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(movie)}
                                                        className="p-2.5 bg-slate-800/50 hover:bg-slate-700 rounded-lg transition text-white"
                                                        title="Edit"
                                                    >
                                                        ✎
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(movie._id)}
                                                        className="p-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition"
                                                        title="Delete"
                                                    >
                                                        🗑
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {movies.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-8 py-16 text-center text-textSecondary font-medium">No movies found in the inventory.</td>
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

export default ManageMovies;
