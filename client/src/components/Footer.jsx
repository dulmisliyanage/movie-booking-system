import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-black border-t border-slate-900 pt-16 pb-8 text-slate-400">
            <div className="px-6 md:px-12 lg:px-20">
                <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4 md:max-w-xs">
                        <Link to="/" className="text-2xl font-bebas text-white flex items-center tracking-[0.2em] group">
                            <div className="relative mr-2 flex items-center justify-center">
                                <span className="relative text-red-600 text-2xl">✦</span>
                            </div>
                            <span>CINE<span className="text-red-600">VERSE</span></span>
                        </Link>
                        <p className="text-textMuted text-xs leading-relaxed font-inter">
                            Step into the spotlight and experience the magic of cinema.
                        </p>
                        <div className="flex space-x-3">
                            {['FB', 'TW', 'IG'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-8 h-8 rounded-full bg-slate-900/50 border border-slate-800 flex items-center justify-center text-[8px] font-black hover:border-primary hover:text-primary transition duration-300"
                                >
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:text-center">
                        <h4 className="text-lg font-bebas tracking-wider uppercase text-white mb-4">Explore</h4>
                        <ul className="flex md:flex-row flex-col gap-6 font-inter text-[10px] font-black uppercase tracking-widest">
                            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                            <li><Link to="/movies" className="hover:text-white transition">Movies</Link></li>
                            <li><Link to="/my-bookings" className="hover:text-white transition">Bookings</Link></li>
                            <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="font-inter md:text-right">
                        <h4 className="text-lg font-bebas tracking-wider uppercase text-white mb-4">Contact</h4>
                        <div className="space-y-3 flex flex-col md:items-end">
                            <div className="flex items-center space-x-3 text-[10px] font-bold tracking-tight">
                                <span className="text-primary">📞</span>
                                <span>+94 11 234 5678</span>
                            </div>
                            <div className="flex items-center space-x-3 text-[10px] font-bold tracking-tight">
                                <span className="text-primary">✉️</span>
                                <span>support@cineverse.lk</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-textMuted text-[9px] font-black uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} CINEVERSE.
                    </p>
                    <div className="flex items-center space-x-4 text-textMuted text-[9px] font-black uppercase tracking-[0.2em]">
                        <span>DOGE BUILT</span>
                        <span>•</span>
                        <span>CINEMATIC TECH</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
