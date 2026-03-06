import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAppStore } from '../../store/useAppStore';
import type { Vehicle } from '../../types';
import { toast } from 'sonner';

export function UpdateKmDialog({ vehicle }: { vehicle: Vehicle }) {
    const { updateVehicle } = useAppStore();
    const [open, setOpen] = useState(false);
    const [newKm, setNewKm] = useState(vehicle.currentKm.toLocaleString('id-ID'));

    const handleKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        if (!rawValue) {
            setNewKm('');
            return;
        }
        setNewKm(parseInt(rawValue).toLocaleString('id-ID'));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedKm = parseInt(newKm.replace(/\D/g, ''));

        if (!parsedKm || parsedKm < vehicle.currentKm) {
            toast.error('Nilai Tidak Valid', { description: 'KM baru harus lebih besar atau sama dengan KM saat ini.' });
            return;
        }

        updateVehicle(vehicle.id, { currentKm: parsedKm });
        toast.success('KM Diperbarui', { description: `Kilometer ${vehicle.name} telah diupdate ke ${newKm} km.` });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-medium rounded-lg">
                    Update KM
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Odometer</DialogTitle>
                    <DialogDescription>
                        Perbarui jarak tempuh terbaru untuk {vehicle.name}. Saat ini: {vehicle.currentKm.toLocaleString('id-ID')} km.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="newkm">Kilometer Terbaru</Label>
                        <div className="relative">
                            <Input
                                id="newkm"
                                inputMode="numeric"
                                className="pr-12"
                                value={newKm}
                                onChange={handleKmChange}
                                autoFocus
                            />
                            <div className="absolute right-3 top-3 text-sm text-muted-foreground">
                                km
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Batal</Button>
                        </DialogClose>
                        <Button type="submit">Update KM</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
