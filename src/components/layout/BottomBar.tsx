import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navItems } from './Sidebar';

export function BottomBar() {
    const location = useLocation();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex-1 flex flex-col items-center justify-center h-full relative"
                        >
                            <div className={`flex flex-col items-center justify-center w-full gap-1 transition-colors ${isActive ? 'text-accent' : 'text-muted-foreground'}`}>
                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-indicator"
                                        className="absolute top-0 w-8 h-1 rounded-b-full bg-accent"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className={`w-5 h-5 ${isActive ? 'fill-accent/20 stroke-[2.5px]' : 'stroke-2'}`} />
                                <span className="text-[10px] font-medium tracking-tight h-3">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
