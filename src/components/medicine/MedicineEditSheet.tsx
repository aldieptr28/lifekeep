import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAppStore } from '../../store/useAppStore';
import type { Medicine, MedicineCategory, MedicineUnit } from '../../types';
import { toast } from 'sonner';

interface Props {
    medicine: Medicine;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MedicineEditSheet({ medicine, open, onOpenChange }: Props) {
    const { updateMedicine } = useAppStore();

    // Extract dosage from notes if formatted as "Dosis: X\nRest"
    const existingNotes = medicine.notes || '';
    const dosageMatch = existingNotes.match(/^Dosis: (.+?)(?:\n|$)/);
    const initialDosage = dosageMatch ? dosageMatch[1] : '';
    const initialNotes = dosageMatch ? existingNotes.replace(/^Dosis: .+?\n?/, '') : existingNotes;

    const [formData, setFormData] = useState({
        name: medicine.name,
        category: medicine.category as MedicineCategory,
        unit: medicine.unit as MedicineUnit,
        dosage: initialDosage,
        currentStock: medicine.currentStock.toString(),
        minThreshold: medicine.minThreshold.toString(),
        notes: initialNotes,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error('Data Belum Lengkap', { description: 'Harap isi nama obat.' });
            return;
        }

        const combinedNotes = formData.dosage
            ? `Dosis: ${formData.dosage}\n${formData.notes}`
            : formData.notes;

        updateMedicine(medicine.id, {
            name: formData.name,
            category: formData.category,
            unit: formData.unit,
            currentStock: parseInt(formData.currentStock) || 0,
            minThreshold: parseInt(formData.minThreshold) || 0,
            notes: combinedNotes,
        });

        toast.success('Obat Diperbarui', { description: `${formData.name} berhasil disimpan.` });
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>Edit Obat</SheetTitle>
                    <SheetDescription>
                        Perbarui informasi obat atau vitamin.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="edit-med-name">Nama Obat</Label>
                        <Input
                            id="edit-med-name"
                            placeholder="Contoh: Paracetamol, Vitamin C"
                            value={formData.name}
                            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-dosage">Dosis / Keterangan (Opsional)</Label>
                        <Input
                            id="edit-dosage"
                            placeholder="Contoh: 500mg, Sirup 50ml"
                            value={formData.dosage}
                            onChange={(e: any) => setFormData({ ...formData, dosage: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Kategori</Label>
                            <Select value={formData.category} onValueChange={(val: any) => setFormData({ ...formData, category: val as MedicineCategory })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="P3K">P3K</SelectItem>
                                    <SelectItem value="Obat Rutin">Obat Rutin</SelectItem>
                                    <SelectItem value="Vitamin">Vitamin</SelectItem>
                                    <SelectItem value="Suplemen">Suplemen</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Satuan</Label>
                            <Select value={formData.unit} onValueChange={(val: any) => setFormData({ ...formData, unit: val as MedicineUnit })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Tablet">Tablet</SelectItem>
                                    <SelectItem value="Kapsul">Kapsul</SelectItem>
                                    <SelectItem value="Botol">Botol</SelectItem>
                                    <SelectItem value="Sachet">Sachet</SelectItem>
                                    <SelectItem value="Strip">Strip</SelectItem>
                                    <SelectItem value="Tube">Tube</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-stock">Stok Saat Ini</Label>
                            <Input
                                id="edit-stock"
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={formData.currentStock}
                                onChange={(e: any) => setFormData({ ...formData, currentStock: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-threshold">Batas Minimum</Label>
                            <Input
                                id="edit-threshold"
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={formData.minThreshold}
                                onChange={(e: any) => setFormData({ ...formData, minThreshold: e.target.value })}
                            />
                            <p className="text-[10px] text-muted-foreground">Peringatan muncul jika stok di bawah ini.</p>
                        </div>
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="edit-med-notes">Catatan (Opsional)</Label>
                        <Textarea
                            id="edit-med-notes"
                            placeholder="Aturan pakai atau indikasi"
                            value={formData.notes}
                            onChange={(e: any) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <SheetFooter className="mt-8 pt-4 border-t border-border">
                        <SheetClose asChild>
                            <Button type="button" variant="outline">Batal</Button>
                        </SheetClose>
                        <Button type="submit">Simpan Perubahan</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
