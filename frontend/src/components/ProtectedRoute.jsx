import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#060d0a]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0fd68c] border-t-transparent"></div>
      </div>
    );
  }

  // Not logged in at all → go to login
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = (user?.role || 'patient').toLowerCase();
  
  // Has role but not allowed → show unauthorized
  // SUPER_ADMIN bypasses all checks
  const isAllowed = role === 'super_admin' || allowedRoles?.some(r => r.toLowerCase() === role);
  
  if (allowedRoles && !isAllowed) {
    console.warn(`[ProtectedRoute] Access Denied. User role "${role}" not in allowed:`, allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
