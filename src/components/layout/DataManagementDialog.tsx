import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Download, Upload, Database } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'sonner';

export function DataManagementDialog() {
    const { vehicles, documents, medicines, notifications, importData } = useAppStore();
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        try {
            const data = {
                vehicles,
                documents,
                medicines,
                notifications,
                version: '1.0'
            };
            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `lifekeep-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success('Backup Berhasil Dibuat', { description: 'File data LifeKeep Anda telah diunduh.' });
        } catch (e) {
            toast.error('Gagal Ekspor Data');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const parsed = JSON.parse(content);

                if (!parsed.vehicles || !parsed.documents || !parsed.medicines) {
                    throw new Error('Invalid format');
                }

                importData({
                    vehicles: parsed.vehicles,
                    documents: parsed.documents,
                    medicines: parsed.medicines,
                    notifications: parsed.notifications || []
                });

                toast.success('Restore Data Berhasil', { description: 'Semua modul telah diperbarui dengan data baru.' });
                setOpen(false);
            } catch (err) {
                toast.error('Gagal Restore Data', { description: 'File JSON rusak atau format tidak dikenali.' });
            }
        };
        reader.readAsText(file);

        // reset input
        e.target.value = '';
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted/50">
                    <Database className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Kelola Data</DialogTitle>
                    <DialogDescription>
                        Ekspor data Anda ke dalam file JSON untuk dicadangkan, atau restore dari file yang sudah ada.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <Button onClick={handleExport} className="w-full flex items-center justify-start gap-3 h-auto py-3 px-4" variant="outline">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Download className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col items-start gap-0.5 text-left">
                            <span className="font-semibold text-sm">Backup Data (Ekspor)</span>
                            <span className="text-[11px] md:text-xs text-muted-foreground font-normal whitespace-normal leading-snug">Unduh semua data LifeKeep ke perangkat Anda</span>
                        </div>
                    </Button>

                    <Button onClick={handleImportClick} className="w-full flex items-center justify-start gap-3 h-auto py-3 px-4" variant="outline">
                        <div className="w-8 h-8 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
                            <Upload className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col items-start gap-0.5 text-left">
                            <span className="font-semibold text-sm">Restore Data (Impor)</span>
                            <span className="text-[11px] md:text-xs text-muted-foreground font-normal whitespace-normal leading-snug">Ganti seluruh data dari file backup JSON</span>
                        </div>
                    </Button>

                    <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
