import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(formData);
            window.location.href = '/movies';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 font-inter">
            <div className="bg-[#121212] p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-slate-800/50">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bebas text-white mb-2 tracking-wider uppercase">Welcome <span className="text-primary">Back</span></h1>
                    <p className="text-slate-400 font-medium text-sm">Please enter your credentials to continue</p>
                </div>

                {error && (
                    <div className="bg-primary/10 border border-primary/50 text-primary px-4 py-3 rounded-xl mb-6 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-[#1A1A1A] border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-primary outline-none transition duration-300"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-[#1A1A1A] border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-primary outline-none transition duration-300"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primaryHover text-white font-black py-4 rounded-xl transition duration-300 transform active:scale-[0.98] shadow-xl shadow-red-900/20 disabled:opacity-50 mt-4 uppercase tracking-widest"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-10 text-center border-t border-slate-800/50 pt-8">
                    <p className="text-slate-500 font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:text-primaryHover font-black transition">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
