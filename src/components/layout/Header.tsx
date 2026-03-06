import { Bell, LogOut, Moon, Sun, Check, Info, AlertTriangle, XCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { DataManagementDialog } from './DataManagementDialog';

export function Header({ isMobile }: { isMobile: boolean }) {
    const { logout } = useAuthStore();
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppStore();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        if (unreadCount > 0) {
            document.title = `(${unreadCount}) LifeKeep`;
        } else {
            document.title = 'LifeKeep';
        }
    }, [unreadCount]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 px-4 md:px-8 h-16 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
                {isMobile && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-bold">
                            L
                        </div>
                        <span className="font-display font-bold text-lg tracking-tight">LifeKeep</span>
                    </div>
                )}
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
                <DataManagementDialog />

                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full relative"
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                    >
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        {unreadCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-destructive border-2 border-background"
                            />
                        )}
                    </Button>

                    <AnimatePresence>
                        {isNotifOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsNotifOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-popover border border-border shadow-lg rounded-xl overflow-hidden z-50 flex flex-col max-h-[400px]"
                                >
                                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold tracking-tight">Notifikasi</h3>
                                            {unreadCount > 0 && (
                                                <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-medium">
                                                    {unreadCount} Baru
                                                </span>
                                            )}
                                        </div>
                                        {unreadCount > 0 && (
                                            <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => markAllNotificationsAsRead()}>
                                                <Check className="w-3 h-3 mr-1" /> Tandai Dibaca
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-2">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                                                <Bell className="w-8 h-8 opacity-20 mb-2" />
                                                <p className="text-sm">Belum ada notifikasi saat ini.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                {notifications.map((n) => {
                                                    const isDanger = n.severity === 'danger';
                                                    const isWarning = n.severity === 'warning';

                                                    const Icon = isDanger ? XCircle : isWarning ? AlertTriangle : Info;
                                                    const colorClass = isDanger ? 'text-destructive bg-destructive/10' : isWarning ? 'text-warning bg-warning/10' : 'text-primary bg-primary/10';

                                                    return (
                                                        <div
                                                            key={n.id}
                                                            className={`p-3 rounded-lg flex items-start gap-3 transition-colors ${n.isRead ? 'opacity-60' : 'bg-muted/30 hover:bg-muted/50'}`}
                                                        >
                                                            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                                                                <Icon className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <p className={`text-sm font-semibold truncate ${n.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                                        {n.title}
                                                                    </p>
                                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap pt-1">
                                                                        {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true, locale: id })}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                                                                    {n.description}
                                                                </p>
                                                            </div>
                                                            {!n.isRead && (
                                                                <button
                                                                    className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5 focus:outline-none"
                                                                    onClick={() => markNotificationAsRead(n.id)}
                                                                    title="Tandai dibaca"
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex" onClick={toggleTheme}>
                    {theme === 'light' ? (
                        <Moon className="w-5 h-5 text-muted-foreground" />
                    ) : (
                        <Sun className="w-5 h-5 text-muted-foreground" />
                    )}
                </Button>

                <div className="w-px h-6 bg-border mx-1"></div>

                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={logout}>
                    <LogOut className="w-5 h-5" />
                </Button>
            </div>
        </header>
    );
}
