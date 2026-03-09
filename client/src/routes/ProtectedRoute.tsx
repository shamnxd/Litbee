import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { ProtectedRouteProps } from '@/types/component.types';

const ProtectedRoute = ({ redirectPath = '/login', isAllowed }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    // Basic authentication check
    if (!isAuthenticated) {
        return <Navigate replace to={redirectPath} />;
    }

    // Email verification check (Except for the verification page itself, but verification page isn't inside ProtectedRoute usually)
    if (user && !user.isVerified) {
        return <Navigate replace to="/verify-email" />;
    }

    // Custom isAllowed check
    const _isAllowed = isAllowed !== undefined ? isAllowed : true;

    if (!_isAllowed) {
        return <Navigate replace to={redirectPath} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
