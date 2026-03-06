import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAppStore } from '../../store/useAppStore';
import type { Vehicle, VehicleType } from '../../types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export function VehicleFormSheet() {
    const { addVehicle } = useAppStore();
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'Motor' as VehicleType,
        year: '',
        plateNumber: '',
        currentKm: '',
        color: '#00E5A0'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.currentKm || !formData.year) {
            toast.error('Data Belum Lengkap', { description: 'Harap isi nama, tahun, dan kilometer saat ini.' });
            return;
        }

        const newVehicle: Vehicle = {
            id: crypto.randomUUID(),
            name: formData.name,
            type: formData.type,
            year: formData.year,
            plateNumber: formData.plateNumber,
            currentKm: parseInt(formData.currentKm.replace(/\D/g, '')),
            color: formData.color,
            history: [],
            maintenanceItems: [
                { id: crypto.randomUUID(), name: 'Ganti Oli Mesin', kmInterval: 2000, monthInterval: 3, lastDoneDate: new Date().toISOString(), lastDoneKm: parseInt(formData.currentKm.replace(/\D/g, '')) },
                { id: crypto.randomUUID(), name: 'Ganti Filter Oli', kmInterval: 6000, monthInterval: 9, lastDoneDate: new Date().toISOString(), lastDoneKm: parseInt(formData.currentKm.replace(/\D/g, '')) },
                { id: crypto.randomUUID(), name: 'Servis Umum', kmInterval: 10000, monthInterval: 12, lastDoneDate: new Date().toISOString(), lastDoneKm: parseInt(formData.currentKm.replace(/\D/g, '')) },
            ]
        };

        addVehicle(newVehicle);
        toast.success('Kendaraan Ditambahkan', { description: `${newVehicle.name} berhasil ditambahkan ke garasi Anda.` });

        // Reset and close
        setFormData({ name: '', type: 'Motor', year: '', plateNumber: '', currentKm: '', color: '#00E5A0' });
        setOpen(false);
    };

    const handleKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Format as 1.000
        const rawValue = e.target.value.replace(/\D/g, '');
        if (!rawValue) {
            setFormData({ ...formData, currentKm: '' });
            return;
        }
        const formattedValue = parseInt(rawValue).toLocaleString('id-ID');
        setFormData({ ...formData, currentKm: formattedValue });
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
                    <SheetTitle>Tambah Kendaraan</SheetTitle>
                    <SheetDescription>
                        Masukkan detail kendaraan baru Anda ke dalam garasi.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Kendaraan</Label>
                        <Input
                            id="name"
                            placeholder="Contoh: Honda Vario 150"
                            value={formData.name}
                            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Jenis</Label>
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
                            <Label htmlFor="year">Tahun</Label>
                            <Input
                                id="year"
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
                            <Label htmlFor="plate">Plat Nomor (Opsional)</Label>
                            <Input
                                id="plate"
                                className="uppercase"
                                placeholder="B 1234 ABC"
                                value={formData.plateNumber}
                                onChange={(e: any) => setFormData({ ...formData, plateNumber: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color">Warna Label</Label>
                            <div className="flex h-10 w-full items-center gap-2">
                                <Input
                                    id="color"
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
                        <Label htmlFor="km">Kilometer Saat Ini (KM)</Label>
                        <div className="relative">
                            <Input
                                id="km"
                                inputMode="numeric"
                                placeholder="15.000"
                                className="pr-12"
                                value={formData.currentKm}
                                onChange={handleKmChange}
                            />
                            <div className="absolute right-3 top-3 text-sm text-muted-foreground">
                                km
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Kilometer awal akan digunakan sebagai basis pengingat servis pertama.</p>
                    </div>

                    <SheetFooter className="mt-8 pt-4 border-t border-border">
                        <SheetClose asChild>
                            <Button type="button" variant="outline">Batal</Button>
                        </SheetClose>
                        <Button type="submit">Simpan Kendaraan</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
