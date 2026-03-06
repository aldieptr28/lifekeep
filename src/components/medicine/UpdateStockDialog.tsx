import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAppStore } from '../../store/useAppStore';
import type { Medicine } from '../../types';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

export function UpdateStockDialog({ medicine }: { medicine: Medicine }) {
    const { updateMedicine } = useAppStore();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'add' | 'consume'>('consume');
    const [amount, setAmount] = useState('1');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const qty = parseInt(amount);

        if (!qty || qty <= 0) {
            toast.error('Jumlah Tidak Valid', { description: 'Masukkan jumlah yang benar.' });
            return;
        }

        if (mode === 'consume' && qty > medicine.currentStock) {
            toast.error('Stok Tidak Cukup', { description: `Hanya tersisa ${medicine.currentStock} ${medicine.name}.` });
            return;
        }

        const newStock = mode === 'add' ? medicine.currentStock + qty : medicine.currentStock - qty;

        const newLog = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            type: mode === 'add' ? 'IN' : 'OUT' as 'IN' | 'OUT',
            qty: qty,
            notes: mode === 'add' ? 'Restock' : 'Konsumsi'
        };
        updateMedicine(medicine.id, {
            currentStock: newStock,
            logs: [newLog, ...medicine.logs]
        });

        toast.success(`Stok Diperbarui`, { description: `Sisa stok ${medicine.name} sekarang: ${newStock}.` });
        setOpen(false);
        setAmount('1');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-medium rounded-lg">
                    Update Stok
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Stok Obat</DialogTitle>
                    <DialogDescription>
                        {medicine.name} — Stok Saat Ini: {medicine.currentStock}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">

                    <div className="flex gap-2 p-1 bg-muted rounded-lg">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'consume' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                            onClick={() => setMode('consume')}
                        >
                            Konsumsi (-&nbsp;)
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'add' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                            onClick={() => setMode('add')}
                        >
                            Restock (+&nbsp;)
                        </button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="qty">Jumlah {mode === 'add' ? 'Ditambahkan' : 'Dikonsumsi'}</Label>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setAmount(Math.max(1, parseInt(amount) - 1).toString())}
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                                id="qty"
                                type="number"
                                inputMode="numeric"
                                min="1"
                                className="text-center font-bold text-lg"
                                value={amount}
                                onChange={(e: any) => setAmount(e.target.value)}
                                autoFocus
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setAmount((parseInt(amount || '0') + 1).toString())}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Batal</Button>
                        </DialogClose>
                        <Button type="submit">Simpan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
