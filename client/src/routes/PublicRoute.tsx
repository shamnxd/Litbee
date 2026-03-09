import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '@/store';

const PublicRoute = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    if (isAuthenticated) {
        if (user && !user.isVerified) {
            return <Navigate to="/verify-email" replace />;
        }
        return <Navigate to="/my-links" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
