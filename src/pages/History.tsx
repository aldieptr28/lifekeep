import { useAppStore } from '../store/useAppStore';
import { Card, CardContent } from '../components/ui/card';
import { Pill, FileText, Wrench, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import type { Vehicle, ServiceHistory, DocumentItem, DocumentHistory, Medicine, MedicineLog } from '../types';

export default function HistoryPage() {
    const { vehicles, documents, medicines } = useAppStore();

    // Aggregate all logs
    const allLogs: any[] = [];

    // 1. Vehicle History
    vehicles.forEach((v: Vehicle) => {
        v.history.forEach((h: ServiceHistory) => {
            allLogs.push({
                ...h,
                _type: 'vehicle',
                _parentName: v.name,
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
                _icon: Pill,
                _color: l.type === 'IN' ? 'text-primary' : 'text-orange-500',
                _bg: l.type === 'IN' ? 'bg-primary/10' : 'bg-orange-500/10'
            });
        });
    });

    // Sort descending by date
    allLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight">Riwayat</h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">Catatan aktivitas dari semua modul.</p>
                </div>
            </div>

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
                    {allLogs.map((log, index) => {
                        const Icon = log._icon;

                        return (
                            <motion.div
                                key={log.id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group select-none"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-transform hover:scale-110">
                                    <div className={`w-full h-full rounded-full flex items-center justify-center ${log._bg} ${log._color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                </div>

                                <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] hover:shadow-md transition-shadow border-border/50 overflow-hidden">
                                    <CardContent className="p-4 flex gap-4 items-start">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                                                </>
                                            )}

                                            {log._type === 'document' && (
                                                <p className="text-sm font-medium text-foreground">{log.notes || 'Pembaruan Dokumen'}</p>
                                            )}

                                            {log._type === 'medicine' && (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {log.notes || (log.type === 'IN' ? 'Restock' : 'Konsumsi')}
                                                        </span>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${log.type === 'IN' ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-500'}`}>
                                                            {log.type === 'IN' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                            {log.qty}
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                            {log.notes && log._type !== 'document' && log._type !== 'medicine' && (
                                                <p className="text-xs text-muted-foreground mt-2 italic border-l-2 border-muted pl-2">
                                                    "{log.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
