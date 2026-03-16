import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { RootState } from '@/store';

const PublicRoute = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (isAuthenticated) {
        if (user && !user.isVerified) {
            // If already on /auth, let them stay to complete verification
            if (location.pathname === '/auth') {
                return <Outlet />;
            }
            return <Navigate to="/auth" replace />;
        }
        return <Navigate to="/my-links" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
