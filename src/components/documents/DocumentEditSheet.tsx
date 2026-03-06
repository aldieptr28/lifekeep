import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useAppStore } from '../../store/useAppStore';
import type { DocumentItem } from '../../types';
import { toast } from 'sonner';

interface Props {
    doc: DocumentItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DocumentEditSheet({ doc, open, onOpenChange }: Props) {
    const { updateDocument } = useAppStore();

    const [formData, setFormData] = useState({
        type: doc.type,
        ownerName: doc.ownerName,
        documentNumber: doc.documentNumber || '',
        expiryDate: doc.expiryDate ? new Date(doc.expiryDate).toISOString().split('T')[0] : '',
        notes: doc.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.type || !formData.ownerName) {
            toast.error('Data Belum Lengkap', { description: 'Harap isi jenis dokumen dan nama pemilik.' });
            return;
        }

        updateDocument(doc.id, {
            type: formData.type,
            ownerName: formData.ownerName,
            documentNumber: formData.documentNumber,
            expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
            notes: formData.notes,
        });

        toast.success('Dokumen Diperbarui', { description: `${formData.type} berhasil disimpan.` });
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>Edit Dokumen</SheetTitle>
                    <SheetDescription>
                        Perbarui detail dokumen Anda.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="edit-type">Jenis Dokumen</Label>
                        <Input
                            id="edit-type"
                            placeholder="Contoh: SIM C, STNK, Paspor"
                            value={formData.type}
                            onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-owner">Nama Pemilik</Label>
                        <Input
                            id="edit-owner"
                            placeholder="Nama tertera di dokumen"
                            value={formData.ownerName}
                            onChange={(e: any) => setFormData({ ...formData, ownerName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-docnum">Nomor Dokumen (Opsional)</Label>
                        <Input
                            id="edit-docnum"
                            placeholder="Nomor identitas dokumen"
                            value={formData.documentNumber}
                            onChange={(e: any) => setFormData({ ...formData, documentNumber: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="edit-date">Tanggal Kedaluwarsa</Label>
                        <Input
                            id="edit-date"
                            type="date"
                            className="block"
                            value={formData.expiryDate}
                            onChange={(e: any) => setFormData({ ...formData, expiryDate: e.target.value })}
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Kosongkan jika dokumen berlaku seumur hidup.</p>
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="edit-notes">Catatan (Opsional)</Label>
                        <Textarea
                            id="edit-notes"
                            placeholder="Misal: Perpanjang di Satpas terdekat"
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
