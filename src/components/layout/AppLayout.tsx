import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomBar } from '@/components/layout/BottomBar';
import { Header } from '@/components/layout/Header';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function AppLayout() {
    const { isAuthenticated } = useAuthStore();
    const { hasHydrated, generateAlerts } = useAppStore();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Responsive check for layout
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (hasHydrated) {
            generateAlerts();
        }
    }, [hasHydrated, generateAlerts]);

    if (!hasHydrated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p>Memuat LifeKeep...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated && location.pathname !== '/login') {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // If we are on the login page but authenticated, redirect to dashboard
    if (isAuthenticated && location.pathname === '/login') {
        return <Navigate to="/" replace />;
    }

    if (location.pathname === '/login') {
        return <Outlet />;
    }

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden relative noise-texture">
            {/* Desktop Sidebar */}
            {!isMobile && <Sidebar />}

            <div className="flex flex-col flex-1 h-full relative z-10 w-full md:pl-64 transition-all duration-300">
                <Header isMobile={isMobile} />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-24 md:pb-8">
                    <div className="max-w-5xl mx-auto w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            {isMobile && <BottomBar />}
        </div>
    );
}
