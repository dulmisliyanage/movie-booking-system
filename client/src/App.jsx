import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import ManageMovies from './pages/ManageMovies';
import ManageShowtimes from './pages/ManageShowtimes';
import ManageBookings from './pages/ManageBookings';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-darkBg text-white">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={
                            <div className="relative h-[calc(100vh-5rem)] flex items-center justify-end overflow-hidden">
                                {/* Background Image with Overlay */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 hover:scale-105"
                                    style={{
                                        backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')`,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-l from-black via-black/70 to-transparent"></div>
                                </div>

                                <div className="container mx-auto px-6 md:px-12 relative z-10 text-right">
                                    <h1 className="text-7xl md:text-9xl font-bebas text-white mb-6 leading-none drop-shadow-2xl tracking-wider animate-reveal font-bebas">
                                        STEP INTO THE <br />
                                        <span className="text-primary delay-200 inline-block">SPOTLIGHT</span> 🎬
                                    </h1>
                                    <p className="text-xl md:text-2xl text-textSecondary mb-10 max-w-2xl ml-auto drop-shadow-lg font-medium leading-relaxed animate-reveal delay-500">
                                        Experience the magic of cinema. Browse the latest blockbusters and reserve your favorite seats in an instant.
                                    </p>
                                    <div className="flex justify-end gap-4 animate-reveal delay-700">
                                        <Link
                                            to="/movies"
                                            className="inline-block bg-primary hover:bg-primaryHover text-white font-black px-10 py-4 rounded-xl transition duration-300 transform hover:scale-105 shadow-2xl shadow-red-900/30 text-lg"
                                        >
                                            Browse Movies
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        } />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/movies" element={<Movies />} />
                        <Route path="/movies/:id" element={<MovieDetails />} />
                        <Route path="/booking/:showtimeId" element={<Booking />} />
                        <Route path="/booking-success/:bookingId" element={<BookingSuccess />} />
                        <Route path="/my-bookings" element={<MyBookings />} />

                        {/* Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/movies"
                            element={
                                <AdminRoute>
                                    <ManageMovies />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/showtimes"
                            element={
                                <AdminRoute>
                                    <ManageShowtimes />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/bookings"
                            element={
                                <AdminRoute>
                                    <ManageBookings />
                                </AdminRoute>
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
