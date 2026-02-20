import { useState, useEffect } from 'react';
import movieService from '../services/movieService';
import MovieCard from '../components/MovieCard';

function Movies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const data = await movieService.getAllMovies();
                setMovies(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('Failed to load movies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const today = new Date();
    const nowShowing = movies.filter(movie => new Date(movie.releaseDate) <= today);
    const comingSoon = movies.filter(movie => new Date(movie.releaseDate) > today);

    if (loading) {
        return (
            <div className="min-h-screen bg-darkBg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-xl text-textMuted font-medium italic font-inter">Loading movies...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-darkBg flex items-center justify-center p-4">
                <div className="bg-primary/10 border border-primary/50 text-red-400 px-6 py-4 rounded-lg inline-block font-inter">
                    {error}
                </div>
            </div>
        );
    }

    const MovieSection = ({ title, emoji, moviesList }) => {
        if (moviesList.length === 0) return null;
        return (
            <div className="mb-20">
                <div className="flex items-center space-x-4 mb-10">
                    <div className="h-10 w-2 bg-primary rounded-full shadow-[0_0_15px_rgba(177,18,38,0.5)]"></div>
                    <h2 className="text-4xl md:text-5xl font-bebas tracking-wider uppercase">
                        {title} <span className="text-primary">{emoji}</span>
                    </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {moviesList.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} isComingSoon={title === "Coming Soon"} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-darkBg pb-20">
            <div className="container mx-auto px-4 py-12">
                {movies.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-textSecondary font-bold italic font-inter">No movies found.</p>
                    </div>
                ) : (
                    <>
                        <MovieSection title="Now Showing" emoji="🎬" moviesList={nowShowing} />
                        <MovieSection title="Coming Soon" emoji="🗓️" moviesList={comingSoon} />
                    </>
                )}
            </div>
        </div>
    );
}

export default Movies;
