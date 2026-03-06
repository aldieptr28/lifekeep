import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAppStore } from '../../store/useAppStore';
import type { Vehicle, VehicleType } from '../../types';
import { toast } from 'sonner';

interface Props {
    vehicle: Vehicle;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function VehicleEditSheet({ vehicle, open, onOpenChange }: Props) {
    const { updateVehicle } = useAppStore();

    const [formData, setFormData] = useState({
        name: vehicle.name,
        type: vehicle.type as VehicleType,
        year: vehicle.year,
        plateNumber: vehicle.plateNumber || '',
        currentKm: vehicle.currentKm.toLocaleString('id-ID'),
        color: vehicle.color || '#00E5A0'
    });

    const handleKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        if (!rawValue) {
            setFormData({ ...formData, currentKm: '' });
            return;
        }
        setFormData({ ...formData, currentKm: parseInt(rawValue).toLocaleString('id-ID') });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.currentKm || !formData.year) {
            toast.error('Data Belum Lengkap', { description: 'Harap isi nama, tahun, dan kilometer saat ini.' });
            return;
        }

        const parsedKm = parseInt(formData.currentKm.replace(/\D/g, ''));
        updateVehicle(vehicle.id, {
            name: formData.name,
            type: formData.type,
            year: formData.year,
            plateNumber: formData.plateNumber,
            currentKm: parsedKm,
            color: formData.color,
        });

        toast.success('Kendaraan Diperbarui', { description: `${formData.name} berhasil disimpan.` });
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>Edit Kendaraan</SheetTitle>
                    <SheetDescription>
                        Perbarui detail kendaraan Anda.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Nama Kendaraan</Label>
                        <Input
                            id="edit-name"
                            placeholder="Contoh: Honda Vario 150"
                            value={formData.name}
                            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-type">Jenis</Label>
                            <Select value={formData.type} onValueChange={(val: any) => setFormData({ ...formData, type: val as VehicleType })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Motor">Motor</SelectItem>
                                    <SelectItem value="Mobil">Mobil</SelectItem>
                                    <SelectItem value="Sepeda">Sepeda</SelectItem>
                                    <SelectItem value="Truk">Truk</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-year">Tahun</Label>
                            <Input
                                id="edit-year"
                                type="number"
                                inputMode="numeric"
                                placeholder="2020"
                                value={formData.year}
                                onChange={(e: any) => setFormData({ ...formData, year: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-plate">Plat Nomor (Opsional)</Label>
                            <Input
                                id="edit-plate"
                                className="uppercase"
                                placeholder="B 1234 ABC"
                                value={formData.plateNumber}
                                onChange={(e: any) => setFormData({ ...formData, plateNumber: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-color">Warna Label</Label>
                            <div className="flex h-10 w-full items-center gap-2">
                                <Input
                                    id="edit-color"
                                    type="color"
                                    className="w-12 h-10 p-1 cursor-pointer"
                                    value={formData.color}
                                    onChange={(e: any) => setFormData({ ...formData, color: e.target.value })}
                                />
                                <span className="text-xs text-muted-foreground uppercase">{formData.color}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-km">Kilometer Saat Ini (KM)</Label>
                        <div className="relative">
                            <Input
                                id="edit-km"
                                inputMode="numeric"
                                placeholder="15.000"
                                className="pr-12"
                                value={formData.currentKm}
                                onChange={handleKmChange}
                            />
                            <div className="absolute right-3 top-3 text-sm text-muted-foreground">km</div>
                        </div>
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
