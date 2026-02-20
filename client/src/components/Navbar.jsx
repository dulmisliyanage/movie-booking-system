import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '../services/authService';

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(authService.getCurrentUser());
    }, []);

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="bg-black/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-2xl">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="text-3xl md:text-4xl font-bebas text-white hover:text-red-500 transition duration-300 flex items-center tracking-[0.2em] group">
                        <div className="relative mr-3 flex items-center justify-center">
                            <div className="absolute inset-0 bg-red-600 blur-[8px] opacity-30 group-hover:opacity-60 transition-opacity"></div>
                            <span className="relative text-red-600 text-4xl drop-shadow-lg">✦</span>
                        </div>
                        <span className="font-bebas">CINE<span className="text-red-600">VERSE</span></span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-8">
                        <Link to="/movies" className="text-slate-300 hover:text-white font-medium transition duration-300">
                            Movies
                        </Link>

                        {user ? (
                            <>
                                <Link to="/my-bookings" className="text-slate-300 hover:text-white font-medium transition duration-300">
                                    My Bookings
                                </Link>

                                {authService.isAdmin() && (
                                    <Link to="/admin" className="text-red-500 hover:text-red-400 font-bold transition duration-300">
                                        Admin
                                    </Link>
                                )}

                                <div className="flex items-center space-x-6 pl-4 border-l border-slate-800">
                                    <div className="hidden lg:block text-right">
                                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest leading-none mb-1">Authenticated</p>
                                        <p className="text-white font-bold leading-none">{user.username}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-slate-800 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-bold transition duration-300 text-sm"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-slate-300 hover:text-white font-medium transition duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-[#B11226] hover:bg-[#E50914] text-white px-6 py-2.5 rounded-lg font-bold transition duration-300 shadow-lg shadow-red-900/20"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
