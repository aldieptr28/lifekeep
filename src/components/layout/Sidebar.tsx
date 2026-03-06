import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CarFront, FileText, Pill, History, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/vehicles', label: 'Kendaraan', icon: CarFront },
    { path: '/documents', label: 'Dokumen', icon: FileText },
    { path: '/medicine', label: 'Obat', icon: Pill },
    { path: '/debts', label: 'Catatan', icon: Wallet },
    { path: '/history', label: 'Riwayat', icon: History },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card/80 backdrop-blur-md border-r border-border hidden md:flex flex-col">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-bold">
                    L
                </div>
                <span className="font-display font-bold text-xl tracking-tight">LifeKeep</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <Link key={item.path} to={item.path}>
                            <div
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative ${isActive ? 'text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-primary rounded-xl -z-10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6">
                <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1 opacity-60">
                    LifeKeep Dashboard <span className="w-1 h-1 rounded-full bg-accent"></span> V1
                </p>
            </div>
        </aside>
    );
}
