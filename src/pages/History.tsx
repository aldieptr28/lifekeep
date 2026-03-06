import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Pill, FileText, Wrench, Calendar, ArrowUpRight, ArrowDownRight, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import type { Vehicle, ServiceHistory, DocumentItem, DocumentHistory, Medicine, MedicineLog } from '../types';
import { toast } from 'sonner';

export default function HistoryPage() {
    const {
        vehicles, documents, medicines,
        deleteVehicleHistoryEntry, deleteMedicineLog, deleteDocumentHistory, clearAllHistory
    } = useAppStore();

    const [confirmClearAll, setConfirmClearAll] = useState(false);

    // Aggregate all logs
    const allLogs: any[] = [];

    // 1. Vehicle History
    vehicles.forEach((v: Vehicle) => {
        v.history.forEach((h: ServiceHistory) => {
            allLogs.push({
                ...h,
                _type: 'vehicle',
                _parentName: v.name,
                _parentId: v.id,
                _icon: Wrench,
                _color: 'text-blue-500',
                _bg: 'bg-blue-500/10'
            });
        });
    });

    // 2. Document History
    documents.forEach((d: DocumentItem) => {
        d.history?.forEach((h: DocumentHistory) => {
            allLogs.push({
                ...h,
                _type: 'document',
                _parentName: d.type,
                _parentId: d.id,
                _icon: FileText,
                _color: 'text-amber-500',
                _bg: 'bg-amber-500/10'
            });
        });
    });

    // 3. Medicine Logs
    medicines.forEach((m: Medicine) => {
        m.logs.forEach((l: MedicineLog) => {
            allLogs.push({
                ...l,
                _type: 'medicine',
                _parentName: m.name,
                _parentId: m.id,
                _icon: Pill,
                _color: l.type === 'IN' ? 'text-primary' : 'text-orange-500',
                _bg: l.type === 'IN' ? 'bg-primary/10' : 'bg-orange-500/10'
            });
        });
    });

    // Sort descending by date
    allLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleDeleteEntry = (log: any) => {
        if (!confirm('Hapus entri riwayat ini?')) return;

        if (log._type === 'vehicle') {
            deleteVehicleHistoryEntry(log._parentId, log.id);
        } else if (log._type === 'medicine') {
            deleteMedicineLog(log._parentId, log.id);
        } else if (log._type === 'document') {
            deleteDocumentHistory(log._parentId, log.id);
        }
        toast.success('Entri Dihapus');
    };

    const handleClearAll = () => {
        if (!confirmClearAll) {
            setConfirmClearAll(true);
            // Auto reset after 5s
            setTimeout(() => setConfirmClearAll(false), 5000);
            return;
        }
        clearAllHistory();
        setConfirmClearAll(false);
        toast.success('Semua Riwayat Dihapus', { description: 'Seluruh catatan aktivitas telah dihapus.' });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight">Riwayat</h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">Catatan aktivitas dari semua modul.</p>
                </div>
                {allLogs.length > 0 && (
                    <Button
                        variant={confirmClearAll ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={handleClearAll}
                        className="transition-colors shrink-0"
                    >
                        {confirmClearAll ? (
                            <>
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Konfirmasi Hapus Semua
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-1" />
                                Hapus Semua
                            </>
                        )}
                    </Button>
                )}
            </div>

            {confirmClearAll && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive font-medium flex items-center gap-2"
                >
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    Klik "Konfirmasi Hapus Semua" sekali lagi untuk menghapus seluruh riwayat. Tindakan ini tidak dapat dibatalkan. Tombol akan hilang dalam 5 detik.
                </motion.div>
            )}

            {allLogs.length === 0 ? (
                <Card className="border-dashed bg-card/30">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Riwayat Kosong</h3>
                        <p className="text-sm mt-1 max-w-sm">Daftar aktivitas seperti servis kendaraan atau stok obat akan muncul di sini.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    <AnimatePresence>
                        {allLogs.map((log, index) => {
                            const Icon = log._icon;

                            return (
                                <motion.div
                                    key={log.id || index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                    transition={{ delay: index * 0.03 }}
                                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group select-none"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-transform hover:scale-110">
                                        <div className={`w-full h-full rounded-full flex items-center justify-center ${log._bg} ${log._color}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] hover:shadow-md transition-shadow border-border/50 overflow-hidden">
                                        <CardContent className="p-4 flex gap-4 items-start">
                                            <div className="flex-1 space-y-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                                                        {log._parentName}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                        {format(new Date(log.date), 'dd MMM yyyy, HH:mm', { locale: id })}
                                                    </span>
                                                </div>

                                                {log._type === 'vehicle' && (
                                                    <>
                                                        <p className="text-sm font-medium text-foreground">{log.maintenanceItemName}</p>
                                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                                                            {log.km && <span className="bg-muted px-2 py-0.5 rounded-full">Odo: {log.km.toLocaleString('id-ID')} km</span>}
                                                            {log.cost > 0 && <span className="bg-muted px-2 py-0.5 rounded-full">Rp {log.cost.toLocaleString('id-ID')}</span>}
                                                            {log.workshop && <span className="bg-muted px-2 py-0.5 rounded-full">{log.workshop}</span>}
                                                        </div>
                                                        {log.notes && (
                                                            <p className="text-xs text-muted-foreground mt-2 italic border-l-2 border-muted pl-2">
                                                                {log.notes}
                                                            </p>
                                                        )}
                                                    </>
                                                )}

                                                {log._type === 'document' && (
                                                    <p className="text-sm font-medium text-foreground">{log.notes || 'Pembaruan Dokumen'}</p>
                                                )}

                                                {log._type === 'medicine' && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {log.notes || (log.type === 'IN' ? 'Restock' : 'Konsumsi')}
                                                        </span>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${log.type === 'IN' ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-500'}`}>
                                                            {log.type === 'IN' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                            {log.qty}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Delete button */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label="Hapus entri ini"
                                                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                onClick={() => handleDeleteEntry(log)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
