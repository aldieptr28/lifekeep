import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useAppStore } from '../../store/useAppStore';
import type { MaintenanceItem, Vehicle } from '../../types';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    vehicle: Vehicle;
    item: MaintenanceItem;
}

export function ServiceTaskDialog({ vehicle, item }: Props) {
    const { updateVehicle } = useAppStore();
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        cost: '',
        workshop: '',
        notes: '',
        km: vehicle.currentKm.toString()
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedKm = parseInt(formData.km.replace(/\D/g, '')) || vehicle.currentKm;
        const parsedCost = parseInt(formData.cost.replace(/\D/g, '')) || 0;

        // Update the maintenance item
        const updatedItems = vehicle.maintenanceItems.map(mItem => {
            if (mItem.id === item.id) {
                return {
                    ...mItem,
                    lastDoneDate: new Date().toISOString(),
                    lastDoneKm: parsedKm
                };
            }
            return mItem;
        });

        // Add to history
        const historyEntry = {
            id: crypto.randomUUID(),
            maintenanceItemId: item.id,
            maintenanceItemName: item.name,
            date: new Date().toISOString(),
            km: parsedKm,
            cost: parsedCost,
            workshop: formData.workshop,
            notes: formData.notes
        };

        updateVehicle(vehicle.id, {
            currentKm: parsedKm > vehicle.currentKm ? parsedKm : vehicle.currentKm, // Update vehicle KM if higher
            maintenanceItems: updatedItems,
            history: [historyEntry, ...vehicle.history]
        });

        toast.success('Servis Disimpan', { description: `Tugas ${item.name} berhasil ditandai selesai.` });
        setOpen(false);
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        if (!rawValue) {
            setFormData({ ...formData, cost: '' });
            return;
        }
        setFormData({ ...formData, cost: parseInt(rawValue).toLocaleString('id-ID') });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-medium rounded-lg text-primary hover:text-primary hover:bg-primary/10">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Selesai
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tandai Servis Selesai</DialogTitle>
                    <DialogDescription>
                        {item.name} untuk {vehicle.name}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="km">Kilometer Saat Servis</Label>
                        <div className="relative">
                            <Input
                                id="km"
                                inputMode="numeric"
                                value={formData.km}
                                onChange={(e: any) => setFormData({ ...formData, km: e.target.value })}
                            />
                            <div className="absolute right-3 top-3 text-sm text-muted-foreground">km</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cost">Biaya (Rp)</Label>
                        <Input
                            id="cost"
                            inputMode="numeric"
                            placeholder="150.000"
                            value={formData.cost}
                            onChange={handleCurrencyChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="workshop">Nama Bengkel</Label>
                        <Input
                            id="workshop"
                            placeholder="Contoh: AHASS"
                            value={formData.workshop}
                            onChange={(e: any) => setFormData({ ...formData, workshop: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Catatan (Opsional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Tambahkan catatan..."
                            value={formData.notes}
                            onChange={(e: any) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <DialogFooter className="pt-2">
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
