import { Link } from 'react-router-dom';

const MovieCard = ({ movie, isComingSoon }) => {
    return (
        <div className="bg-cardBg rounded-xl overflow-hidden shadow-2xl border border-slate-800 hover:border-primary/50 transition duration-300 group">
            {/* Poster */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={movie.poster || 'https://via.placeholder.com/400x600?text=No+Poster'}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                {!isComingSoon && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded">
                        ★ {movie.rating}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 font-inter">
                <h3 className="text-2xl font-bebas text-white mb-1 truncate leading-tight tracking-wider">{movie.title}</h3>
                <div className="flex items-center text-textSecondary text-[10px] mb-4 space-x-1.5 font-bold uppercase tracking-wider">
                    <span>{movie.genre}</span>
                    <span>•</span>
                    <span>{movie.duration} min</span>
                </div>

                <Link
                    to={`/movies/${movie._id}`}
                    className={`block w-full text-center font-black py-2.5 rounded-lg transition duration-200 text-xs uppercase tracking-widest ${isComingSoon
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-default'
                            : 'bg-primary hover:bg-primaryHover text-white'
                        }`}
                >
                    {isComingSoon ? 'Coming Soon' : 'Book Now'}
                </Link>
            </div>
        </div>
    );
};

export default MovieCard;
