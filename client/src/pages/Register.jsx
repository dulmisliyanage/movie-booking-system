import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            await authService.register(registerData);
            window.location.href = '/movies';
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 font-inter">
            <div className="bg-[#121212] p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-slate-800/50">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bebas text-white mb-2 tracking-wider uppercase">Join the <span className="text-primary">Cinema</span></h1>
                    <p className="text-slate-400 font-medium text-sm">Create an account to start booking movies</p>
                </div>

                {error && (
                    <div className="bg-primary/10 border border-primary/50 text-primary px-4 py-3 rounded-xl mb-6 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-[#1A1A1A] border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-primary outline-none transition duration-300"
                            placeholder="johndoe"
                            required
                        />
                    </div>

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

                    <div>
                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
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
                        {loading ? 'Processing...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-10 text-center border-t border-slate-800/50 pt-8">
                    <p className="text-slate-500 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primaryHover font-black transition">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
