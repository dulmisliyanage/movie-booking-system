import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import movieService from '../services/movieService';
import showtimeService from '../services/showtimeService';

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                setLoading(true);
                const [movieData, showtimesData] = await Promise.all([
                    movieService.getMovie(id),
                    showtimeService.getShowtimesByMovie(id)
                ]);
                setMovie(movieData);
                setShowtimes(showtimesData);
                setError(null);
            } catch (err) {
                console.error('Error fetching movie details:', err);
                setError('Failed to load movie details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-darkBg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center p-4">
                <div className="bg-primary/10 border border-primary/50 text-red-400 px-6 py-4 rounded-lg mb-4">
                    {error || 'Movie not found'}
                </div>
                <Link to="/movies" className="text-textMuted hover:text-white transition uppercase text-xs font-black tracking-widest">
                    &larr; Back to Movies
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-darkBg text-white pb-20 font-sans">
            {/* Top Hero Section */}
            <div className="bg-secondaryBg border-b border-slate-800/50">
                <div className="container mx-auto px-4 py-12 md:py-20">
                    <div className="flex flex-col md:flex-row gap-10">
                        {/* Poster */}
                        <div className="w-full md:w-1/3 max-w-sm mx-auto md:mx-0 shadow-2xl rounded-xl overflow-hidden border border-slate-700">
                            <img
                                src={movie.poster || 'https://via.placeholder.com/400x600?text=No+Poster'}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <h1 className="text-5xl md:text-8xl font-bebas mb-6 tracking-wider leading-none">{movie.title}</h1>

                            <div className="flex items-center space-x-5 text-textSecondary mb-8 flex-wrap gap-y-3 font-inter">
                                {new Date(movie.releaseDate) <= new Date() && (
                                    <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black border border-primary/20 flex items-center">
                                        <span className="mr-1">★</span> {movie.rating}
                                    </span>
                                )}
                                <span className="font-bold text-sm tracking-tight">{movie.genre}</span>
                                <span className="text-slate-800">•</span>
                                <span className="font-bold text-sm tracking-tight">{movie.duration} min</span>
                                <span className="text-slate-800">•</span>
                                <span className="font-bold text-sm tracking-tight">{new Date(movie.releaseDate).getFullYear()}</span>
                            </div>

                            <p className="text-lg md:text-xl text-textSecondary leading-relaxed max-w-3xl mb-10 font-medium italic font-inter">
                                "{movie.description}"
                            </p>

                            <Link
                                to="/movies"
                                className="text-textMuted hover:text-white flex items-center transition font-black group text-sm uppercase tracking-widest font-inter"
                            >
                                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Movies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="flex items-center space-x-4 mb-12">
                    <div className="h-10 w-2 bg-primary rounded-full shadow-[0_0_15px_rgba(177,18,38,0.5)]"></div>
                    <h2 className="text-4xl md:text-5xl font-bebas tracking-wider uppercase">Available <span className="text-primary">Showtimes</span></h2>
                </div>

                {showtimes.length === 0 ? (
                    <div className="bg-cardBg rounded-2xl p-20 text-center border border-slate-800/50 shadow-xl">
                        <div className="text-5xl mb-4">🎬</div>
                        <p className="text-textSecondary text-xl font-medium">Coming soon to this theater!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {showtimes.map((showtime) => (
                            <div
                                key={showtime._id}
                                className="bg-cardBg border border-slate-800/50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between hover:border-primary/40 hover:bg-[#1C1C1C] transition duration-300 group shadow-lg"
                            >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full md:w-auto mb-8 md:mb-0">
                                    <div className="text-center md:text-left">
                                        <div className="text-textMuted text-xs font-black uppercase tracking-widest mb-2">Hall</div>
                                        <div className="text-xl font-bold text-white uppercase">{showtime.hall}</div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <div className="text-textMuted text-xs font-black uppercase tracking-widest mb-2">Showtime</div>
                                        <div className="text-2xl font-black text-primary group-hover:scale-110 transition-transform origin-left">{showtime.time}</div>
                                    </div>
                                    <div className="text-center md:text-left col-span-2 md:col-span-1">
                                        <div className="text-textMuted text-xs font-black uppercase tracking-widest mb-2">Ticket Price</div>
                                        <div className="text-xl font-bold text-white">LKR {showtime.price.toLocaleString()}</div>
                                    </div>
                                </div>

                                <Link
                                    to={`/booking/${showtime._id}`}
                                    className="w-full md:w-auto bg-primary hover:bg-primaryHover text-white font-black px-12 py-4 rounded-xl transition duration-300 transform hover:scale-105 shadow-xl shadow-red-900/20 text-center"
                                >
                                    Select Seats
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieDetails;
