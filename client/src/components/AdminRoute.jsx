import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const AdminRoute = ({ children }) => {
    const user = authService.getCurrentUser();
    const isAdmin = authService.isAdmin();

    if (!user || !isAdmin) {
        // Not logged in or not an admin, redirect to movies page
        return <Navigate to="/movies" replace />;
    }

    return children;
};

export default AdminRoute;
