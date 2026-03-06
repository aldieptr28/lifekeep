import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Wrench, MoreVertical, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { VehicleFormSheet } from '../components/vehicles/VehicleFormSheet';
import { UpdateKmDialog } from '../components/vehicles/UpdateKmDialog';
import { ServiceTaskDialog } from '../components/vehicles/ServiceTaskDialog';
import type { Vehicle, MaintenanceItem } from '../types';

export default function Vehicles() {
    const { vehicles } = useAppStore();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight">Kendaraan</h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">Kelola jadwal servis dan odometer.</p>
                </div>
                <VehicleFormSheet />
            </div>

            {vehicles.length === 0 ? (
                <Card className="border-dashed bg-card/30">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4">
                            <Wrench className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Garasi Kosong</h3>
                        <p className="text-sm mt-1 max-w-sm">Belum ada kendaraan yang ditambahkan. Klik tombol tambah untuk memulai.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((v: Vehicle) => (
                        <motion.div
                            key={v.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="overflow-hidden border-border/50 hover:shadow-md transition-shadow group flex flex-col h-full">
                                <div className="h-2 w-full" style={{ backgroundColor: v.color || '#00E5A0' }} />
                                <CardHeader className="pb-2 pt-4 flex flex-row items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold font-display">{v.name}</CardTitle>
                                        <CardDescription className="opacity-80">{v.type} • {v.year} • {v.plateNumber || 'Rutin'}</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 text-muted-foreground hover:bg-muted/50">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center justify-between border-y border-border/50 py-3 bg-muted/20 -mx-6 px-6">
                                            <div className="flex items-center gap-2">
                                                <Gauge className="w-5 h-5 text-accent" />
                                                <span className="font-semibold text-lg tracking-tight">{v.currentKm.toLocaleString('id-ID')} km</span>
                                            </div>
                                            <UpdateKmDialog vehicle={v} />
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                                                <Wrench className="w-4 h-4 text-muted-foreground" />
                                                Tugas Servis ({v.maintenanceItems.length})
                                            </h4>
                                            <div className="space-y-4">
                                                {v.maintenanceItems.slice(0, 4).map((item: MaintenanceItem) => {
                                                    const kmProgress = v.currentKm - item.lastDoneKm;
                                                    const progressPercentage = Math.min(100, Math.max(0, (kmProgress / item.kmInterval) * 100));
                                                    const isWarning = progressPercentage >= 85;
                                                    const isDanger = progressPercentage >= 100;

                                                    const colorClass = isDanger ? 'bg-destructive' : isWarning ? 'bg-warning' : 'bg-primary';

                                                    return (
                                                        <div key={item.id} className="space-y-1.5">
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className="font-medium truncate pr-2">{item.name}</span>
                                                                <ServiceTaskDialog vehicle={v} item={item} />
                                                            </div>
                                                            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                                                <span>{kmProgress.toLocaleString('id-ID')} km dari {item.kmInterval.toLocaleString('id-ID')} km</span>
                                                                <span className={isDanger ? 'text-destructive font-bold' : isWarning ? 'text-warning font-bold' : ''}>
                                                                    {Math.round(progressPercentage)}%
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className={`h-full rounded-full ${colorClass}`}
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${progressPercentage}%` }}
                                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
