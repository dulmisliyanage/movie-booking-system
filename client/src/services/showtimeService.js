import api from './api';

export const showtimeService = {
    // Get all showtimes
    getAllShowtimes: async () => {
        const response = await api.get('/showtimes');
        return response.data;
    },

    // Get showtimes for a specific movie
    getShowtimesByMovie: async (movieId) => {
        const response = await api.get(`/showtimes?movieId=${movieId}`);
        return response.data;
    },

    // Get single showtime
    getShowtime: async (id) => {
        const response = await api.get(`/showtimes/${id}`);
        return response.data;
    },

    // Create showtime (admin only)
    createShowtime: async (showtimeData) => {
        const response = await api.post('/showtimes', showtimeData);
        return response.data;
    },

    // Update showtime (admin only)
    updateShowtime: async (id, showtimeData) => {
        const response = await api.put(`/showtimes/${id}`, showtimeData);
        return response.data;
    },

    // Delete showtime (admin only)
    deleteShowtime: async (id) => {
        const response = await api.delete(`/showtimes/${id}`);
        return response.data;
    },
};

export default showtimeService;
