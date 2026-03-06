import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { FileText, MoreVertical, CalendarClock, ShieldAlert, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { DocumentItem } from '../types';
import { format, differenceInDays } from 'date-fns';
import { DocumentFormSheet } from '../components/documents/DocumentFormSheet';
import { DocumentEditSheet } from '../components/documents/DocumentEditSheet';
import { toast } from 'sonner';

export default function Documents() {
    const { documents, deleteDocument } = useAppStore();
    const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

    const getStatus = (doc: DocumentItem) => {
        if (!doc.expiryDate) return { label: 'Permanen', color: 'bg-muted text-muted-foreground', border: 'border-border' };
        const daysLeft = differenceInDays(new Date(doc.expiryDate), new Date());
        if (daysLeft < 0) return { label: 'Expired', color: 'bg-destructive/10 text-destructive', border: 'border-destructive/30' };
        if (daysLeft <= 7) return { label: 'Kritis', color: 'bg-warning/10 text-warning', border: 'border-warning/30' };
        if (daysLeft <= 30) return { label: 'Perhatian', color: 'bg-blue-500/10 text-blue-500', border: 'border-blue-500/30' };
        return { label: 'Aman', color: 'bg-primary/10 text-primary', border: 'border-primary/30' };
    };

    const handleDelete = (doc: DocumentItem) => {
        if (confirm(`Hapus dokumen "${doc.type}"? Tindakan ini tidak dapat dibatalkan.`)) {
            deleteDocument(doc.id);
            toast.success('Dokumen Dihapus', { description: `${doc.type} telah dihapus.` });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight">Dokumen</h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">Masa berlaku dokumen penting.</p>
                </div>
                <DocumentFormSheet />
            </div>

            {documents.length === 0 ? (
                <Card className="border-dashed bg-card/30">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Kosong</h3>
                        <p className="text-sm mt-1 max-w-sm">Belum ada dokumen yang dilacak. Klik tombol tambah untuk memulai.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {documents.map((doc: DocumentItem) => {
                        const status = getStatus(doc);
                        const daysLeft = doc.expiryDate ? differenceInDays(new Date(doc.expiryDate), new Date()) : null;

                        return (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className={`overflow-hidden border group hover:shadow-md transition-shadow h-full flex flex-col ${status.border}`}>
                                    <CardHeader className="pb-3 flex flex-row items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <CardTitle className="text-xl font-bold font-display leading-tight mt-1">{doc.type}</CardTitle>
                                            <CardDescription className="opacity-80 mt-1">{doc.ownerName}</CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label="Opsi dokumen"
                                                    className="h-8 w-8 -mt-2 -mr-2 text-muted-foreground hover:bg-muted/50"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setEditingDoc(doc)}>
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(doc)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col justify-end pt-2">
                                        {doc.expiryDate ? (
                                            <div className="p-3 bg-muted/30 rounded-xl space-y-1 w-full border border-border/50">
                                                <div className="flex items-center text-xs text-muted-foreground gap-1.5 mb-1">
                                                    <CalendarClock className="w-3.5 h-3.5" /> Berakhir pada
                                                </div>
                                                <p className="font-semibold text-foreground">
                                                    {format(new Date(doc.expiryDate), 'dd MMM yyyy')}
                                                </p>
                                                <p className={`text-xs font-medium pt-1 ${daysLeft && daysLeft < 0 ? 'text-destructive' : daysLeft && daysLeft <= 30 ? 'text-warning' : 'text-muted-foreground'}`}>
                                                    {daysLeft !== null && daysLeft < 0 ? `Lewat ${Math.abs(daysLeft)} hari` : `${daysLeft} hari lagi`}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-muted/30 rounded-xl flex items-center gap-2 border border-border/50">
                                                <ShieldAlert className="w-4 h-4 text-primary opacity-50" />
                                                <p className="text-sm font-medium text-foreground opacity-70">Dokumen Permanen</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {editingDoc && (
                <DocumentEditSheet
                    doc={editingDoc}
                    open={!!editingDoc}
                    onOpenChange={(open) => { if (!open) setEditingDoc(null); }}
                />
            )}
        </div>
    );
}
