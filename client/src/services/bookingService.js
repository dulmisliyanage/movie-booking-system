import api from './api';

export const bookingService = {
    // Create a new booking
    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    // Get current user's bookings
    getMyBookings: async () => {
        const response = await api.get('/bookings/my');
        return response.data;
    },

    // Get all bookings (admin only)
    getAllBookings: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },

    // Get single booking
    getBooking: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    // Cancel booking
    cancelBooking: async (id) => {
        const response = await api.put(`/bookings/${id}/cancel`);
        return response.data;
    },
};

export default bookingService;
