import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useAppStore } from '../../store/useAppStore';
import type { Medicine } from '../../types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export function MedicineFormSheet() {
    const { addMedicine } = useAppStore();
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        currentStock: '0',
        minThreshold: '5',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.currentStock || !formData.minThreshold) {
            toast.error('Data Belum Lengkap', { description: 'Harap isi nama obat, stok saat ini, dan batas minimum.' });
            return;
        }

        const newMed: Medicine = {
            id: crypto.randomUUID(),
            name: formData.name,
            category: 'P3K', // Default, we can expand form later
            unit: 'Tablet',  // Default
            purchaseDate: new Date().toISOString(),
            currentStock: parseInt(formData.currentStock.replace(/\D/g, '')),
            minThreshold: parseInt(formData.minThreshold.replace(/\D/g, '')),
            notes: formData.dosage ? `Dosis: ${formData.dosage}\n${formData.notes}` : formData.notes,
            logs: []
        };

        addMedicine(newMed);
        toast.success('Obat Ditambahkan', { description: `${newMed.name} berhasil ditambahkan ke inventaris.` });

        // Reset and close
        setFormData({ name: '', dosage: '', currentStock: '0', minThreshold: '5', notes: '' });
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    <Plus className="w-5 h-5 mr-1" />
                    Tambah
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>Tambah Stok Obat</SheetTitle>
                    <SheetDescription>
                        Masukkan data obat baru untuk memantau sisa stok dan penggunaan.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Obat</Label>
                        <Input
                            id="name"
                            placeholder="Contoh: Paracetamol, Vitamin C"
                            value={formData.name}
                            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dosage">Dosis / Keterangan (Opsional)</Label>
                        <Input
                            id="dosage"
                            placeholder="Contoh: 500mg, Sirup 50ml"
                            value={formData.dosage}
                            onChange={(e: any) => setFormData({ ...formData, dosage: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stok Saat Ini</Label>
                            <Input
                                id="stock"
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={formData.currentStock}
                                onChange={(e: any) => setFormData({ ...formData, currentStock: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="threshold">Batas Minimum</Label>
                            <Input
                                id="threshold"
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={formData.minThreshold}
                                onChange={(e: any) => setFormData({ ...formData, minThreshold: e.target.value })}
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">Peringatan muncul jika stok di bawah ini.</p>
                        </div>
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="notes">Catatan (Opsional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Aturan pakai atau indikasi"
                            value={formData.notes}
                            onChange={(e: any) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <SheetFooter className="mt-8 pt-4 border-t border-border">
                        <SheetClose asChild>
                            <Button type="button" variant="outline">Batal</Button>
                        </SheetClose>
                        <Button type="submit">Simpan Obat</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
