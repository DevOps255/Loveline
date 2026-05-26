import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from '../components/common/Protectedroute';

// Pages
import AuthPage from '../pages/auth/AuthPage';
import CompleteProfile from '../pages/profile/CompleteProfile';
import Dashboard from '../pages/home/Dashboard';
import LandingPage from '../pages/landing/LandingPage';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth */}
            <Route 
                path="/auth" 
                element={
                    <GuestRoute>
                        <AuthPage />
                    </GuestRoute>
                } 
            />
            
            <Route 
                path="/complete-profile" 
                element={
                    <ProtectedRoute>
                        <CompleteProfile />
                    </ProtectedRoute>
                } 
            />

            {/* Dashboard */}
            <Route
                path="/app/*"
                element={
                    <ProtectedRoute>
                        <Dashboard onLogout={() => window.location.href = '/'} />
                    </ProtectedRoute>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
