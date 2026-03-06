import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useAppStore } from '../../store/useAppStore';
import type { DocumentItem } from '../../types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export function DocumentFormSheet() {
    const { addDocument } = useAppStore();
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        type: '',
        ownerName: '',
        documentNumber: '',
        expiryDate: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.type || !formData.ownerName) {
            toast.error('Data Belum Lengkap', { description: 'Harap isi jenis dokumen dan nama pemilik.' });
            return;
        }

        const newDoc: DocumentItem = {
            id: crypto.randomUUID(),
            type: formData.type,
            ownerName: formData.ownerName,
            documentNumber: formData.documentNumber,
            expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
            reminderDays: [30, 14, 7, 1], // Default reminder schedule
            notes: formData.notes,
            history: []
        };

        addDocument(newDoc);
        toast.success('Dokumen Ditambahkan', { description: `${newDoc.type} berhasil disimpan.` });

        // Reset and close
        setFormData({ type: '', ownerName: '', documentNumber: '', expiryDate: '', notes: '' });
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
                    <SheetTitle>Tambah Dokumen</SheetTitle>
                    <SheetDescription>
                        Simpan data dokumen penting dan atur pengingat kedaluwarsa.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="type">Jenis Dokumen</Label>
                        <Input
                            id="type"
                            placeholder="Contoh: SIM C, STNK, Paspor"
                            value={formData.type}
                            onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="owner">Nama Pemilik</Label>
                        <Input
                            id="owner"
                            placeholder="Nama tertera di dokumen"
                            value={formData.ownerName}
                            onChange={(e: any) => setFormData({ ...formData, ownerName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="docnum">Nomor Dokumen (Opsional)</Label>
                        <Input
                            id="docnum"
                            placeholder="Nomor identitas dokumen"
                            value={formData.documentNumber}
                            onChange={(e: any) => setFormData({ ...formData, documentNumber: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="date">Tanggal Kedaluwarsa</Label>
                        <Input
                            id="date"
                            type="date"
                            className="block"
                            value={formData.expiryDate}
                            onChange={(e: any) => setFormData({ ...formData, expiryDate: e.target.value })}
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Kosongkan jika dokumen berlaku seumur hidup.</p>
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="notes">Catatan (Opsional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Misal: Perpanjang di Satpas terdekat"
                            value={formData.notes}
                            onChange={(e: any) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <SheetFooter className="mt-8 pt-4 border-t border-border">
                        <SheetClose asChild>
                            <Button type="button" variant="outline">Batal</Button>
                        </SheetClose>
                        <Button type="submit">Simpan Dokumen</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
