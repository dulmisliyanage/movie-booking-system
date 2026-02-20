import api from './api';

export const movieService = {
    // Get all movies
    getAllMovies: async () => {
        const response = await api.get('/movies');
        return response.data;
    },

    // Get single movie
    getMovie: async (id) => {
        const response = await api.get(`/movies/${id}`);
        return response.data;
    },

    // Create movie (admin only)
    createMovie: async (movieData) => {
        const response = await api.post('/movies', movieData);
        return response.data;
    },

    // Update movie (admin only)
    updateMovie: async (id, movieData) => {
        const response = await api.put(`/movies/${id}`, movieData);
        return response.data;
    },

    // Delete movie (admin only)
    deleteMovie: async (id) => {
        const response = await api.delete(`/movies/${id}`);
        return response.data;
    },
};

export default movieService;
