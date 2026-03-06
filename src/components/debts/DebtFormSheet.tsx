import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAppStore } from '../../store/useAppStore';
import type { Debt, DebtType } from '../../types';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** If provided, we are in Edit mode */
    debt?: Debt;
}

const emptyForm = {
    personName: '',
    amount: '',
    type: 'to_me' as DebtType,
    dueDate: '',
    description: '',
};

export function DebtFormSheet({ open, onOpenChange, debt }: Props) {
    const { addDebt, updateDebt } = useAppStore();
    const isEdit = !!debt;

    const [formData, setFormData] = useState(emptyForm);

    // When the sheet opens, pre-fill for edit or reset for add
    useEffect(() => {
        if (open) {
            if (debt) {
                setFormData({
                    personName: debt.personName,
                    amount: debt.amount.toLocaleString('id-ID'),
                    type: debt.type,
                    dueDate: debt.dueDate ? new Date(debt.dueDate).toISOString().split('T')[0] : '',
                    description: debt.description || '',
                });
            } else {
                setFormData(emptyForm);
            }
        }
    }, [open, debt]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        if (!rawValue) {
            setFormData({ ...formData, amount: '' });
            return;
        }
        setFormData({ ...formData, amount: parseInt(rawValue).toLocaleString('id-ID') });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.personName.trim()) {
            toast.error('Nama Wajib Diisi', { description: 'Masukkan nama debitur atau kreditur.' });
            return;
        }
        const parsedAmount = parseInt(formData.amount.replace(/\D/g, ''));
        if (!parsedAmount || parsedAmount <= 0) {
            toast.error('Nominal Tidak Valid', { description: 'Masukkan nominal utang/piutang yang benar.' });
            return;
        }

        if (isEdit && debt) {
            updateDebt(debt.id, {
                personName: formData.personName.trim(),
                amount: parsedAmount,
                type: formData.type,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
                description: formData.description,
            });
            toast.success('Catatan Diperbarui', { description: `Data ${formData.personName} berhasil disimpan.` });
        } else {
            const newDebt: Debt = {
                id: crypto.randomUUID(),
                personName: formData.personName.trim(),
                amount: parsedAmount,
                type: formData.type,
                date: new Date().toISOString(),
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
                description: formData.description,
                status: 'unpaid',
                logs: [],
            };
            addDebt(newDebt);
            toast.success('Catatan Ditambahkan', { description: `${formData.personName} berhasil dicatat.` });
        }

        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>{isEdit ? 'Edit Catatan' : 'Catat Utang / Piutang Baru'}</SheetTitle>
                    <SheetDescription>
                        {isEdit ? 'Perbarui detail catatan ini.' : 'Tambahkan catatan utang atau piutang baru.'}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Type Toggle */}
                    <div className="space-y-2">
                        <Label>Jenis Catatan</Label>
                        <div className="flex gap-2 p-1 bg-muted rounded-lg">
                            <button
                                type="button"
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${formData.type === 'to_me' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                                onClick={() => setFormData({ ...formData, type: 'to_me' })}
                            >
                                💰 Piutang (ke Saya)
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${formData.type === 'to_other' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                                onClick={() => setFormData({ ...formData, type: 'to_other' })}
                            >
                                📤 Utang (ke Orang)
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="debt-person">
                            {formData.type === 'to_me' ? 'Nama Peminjam' : 'Nama Pemberi Pinjaman'}
                        </Label>
                        <Input
                            id="debt-person"
                            placeholder={formData.type === 'to_me' ? 'Siapa yang berhutang kepada Anda?' : 'Anda berhutang kepada siapa?'}
                            value={formData.personName}
                            onChange={(e: any) => setFormData({ ...formData, personName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="debt-amount">Nominal (Rp)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-sm text-muted-foreground">Rp</span>
                            <Input
                                id="debt-amount"
                                inputMode="numeric"
                                placeholder="500.000"
                                className="pl-9"
                                value={formData.amount}
                                onChange={handleAmountChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="debt-duedate">Tanggal Jatuh Tempo (Opsional)</Label>
                        <Input
                            id="debt-duedate"
                            type="date"
                            className="block"
                            value={formData.dueDate}
                            onChange={(e: any) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="debt-desc">Keterangan (Opsional)</Label>
                        <Textarea
                            id="debt-desc"
                            placeholder="Misal: untuk bayar tagihan listrik..."
                            value={formData.description}
                            onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <SheetFooter className="mt-8 pt-4 border-t border-border">
                        <SheetClose asChild>
                            <Button type="button" variant="outline">Batal</Button>
                        </SheetClose>
                        <Button type="submit">{isEdit ? 'Simpan Perubahan' : 'Catat Sekarang'}</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
