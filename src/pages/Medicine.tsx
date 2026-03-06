import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Pill, Activity, MoreVertical, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Medicine } from '../types';
import { MedicineFormSheet } from '../components/medicine/MedicineFormSheet';
import { MedicineEditSheet } from '../components/medicine/MedicineEditSheet';
import { UpdateStockDialog } from '../components/medicine/UpdateStockDialog';
import { toast } from 'sonner';

export default function MedicinePage() {
    const { medicines, deleteMedicine } = useAppStore();
    const [editingMed, setEditingMed] = useState<Medicine | null>(null);

    const handleDelete = (med: Medicine) => {
        if (confirm(`Hapus "${med.name}" dari inventaris? Tindakan ini tidak dapat dibatalkan.`)) {
            deleteMedicine(med.id);
            toast.success('Obat Dihapus', { description: `${med.name} telah dihapus dari inventaris.` });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight">Obat & Vitamin</h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">Pantau ketersediaan stok kotak P3K.</p>
                </div>
                <MedicineFormSheet />
            </div>

            {medicines.length === 0 ? (
                <Card className="border-dashed bg-card/30">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4">
                            <Pill className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Kotak P3K Kosong</h3>
                        <p className="text-sm mt-1 max-w-sm">Anda belum menambahkan daftar obat atau vitamin. Klik tombol tambah untuk memulai.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {medicines.map((med: Medicine) => {
                        const isLowStock = med.currentStock <= med.minThreshold;
                        const isOutOfStock = med.currentStock === 0;

                        return (
                            <motion.div
                                key={med.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className={`overflow-hidden border group hover:shadow-md transition-shadow h-full flex flex-col ${isOutOfStock ? 'border-destructive/50' : isLowStock ? 'border-warning/50' : 'border-border/50'}`}>
                                    <CardHeader className="pb-3 flex flex-row items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                {isOutOfStock ? (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-destructive/10 text-destructive flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" /> Habis
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-warning/10 text-warning flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" /> Menipis
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                        Tersedia
                                                    </span>
                                                )}
                                            </div>
                                            <CardTitle className="text-xl font-bold font-display leading-tight mt-1">{med.name}</CardTitle>
                                            <CardDescription className="opacity-80 mt-1">{med.category} • {med.unit}</CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label="Opsi obat"
                                                    className="h-8 w-8 -mt-2 -mr-2 text-muted-foreground hover:bg-muted/50"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setEditingMed(med)}>
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(med)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col justify-end pt-2">
                                        <div className="space-y-4 flex-1 flex flex-col justify-end">
                                            <div className="flex items-center justify-between border-y border-border/50 py-3 bg-muted/20 -mx-6 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${isOutOfStock ? 'bg-destructive/10' : 'bg-background'}`}>
                                                        <Activity className={`w-5 h-5 ${isOutOfStock ? 'text-destructive' : 'text-muted-foreground'}`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-0.5">Sisa Stok</p>
                                                        <span className={`font-semibold text-lg tracking-tight leading-none ${isOutOfStock ? 'text-destructive' : ''}`}>
                                                            {med.currentStock} <span className="text-xs font-normal text-muted-foreground">{med.unit}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <UpdateStockDialog medicine={med} />
                                            </div>

                                            {med.notes && (
                                                <p className="text-xs text-muted-foreground italic line-clamp-2">
                                                    {med.notes}
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

            {editingMed && (
                <MedicineEditSheet
                    medicine={editingMed}
                    open={!!editingMed}
                    onOpenChange={(open) => { if (!open) setEditingMed(null); }}
                />
            )}
        </div>
    );
}
