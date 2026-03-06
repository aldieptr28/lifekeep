import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Check, Trash2, HelpCircle, Pencil, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { formatCurrency, formatDate } from '../lib/utils';
import { DebtFormSheet } from '../components/debts/DebtFormSheet';
import type { Debt } from '../types';
import { toast } from 'sonner';

export default function Debts() {
    const { debts, deleteDebt, updateDebt } = useAppStore();
    const [addSheetOpen, setAddSheetOpen] = useState(false);
    const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

    const utang = debts.filter(d => d.type === 'to_other');
    const piutang = debts.filter(d => d.type === 'to_me');

    const handleMarkAsPaid = (id: string) => {
        updateDebt(id, { status: 'paid' });
        toast.success('Ditandai Lunas', { description: 'Catatan diperbarui menjadi lunas.' });
    };

    const handleDelete = (debt: Debt) => {
        if (confirm(`Hapus catatan "${debt.personName}"? Tindakan ini tidak dapat dibatalkan.`)) {
            deleteDebt(debt.id);
            toast.success('Catatan Dihapus');
        }
    };

    const renderDebtCard = (debt: Debt) => {
        const isPaid = debt.status === 'paid';
        return (
            <Card key={debt.id} className={`border-border/50 relative overflow-hidden transition-all ${isPaid ? 'opacity-70 bg-card/40' : 'bg-card/80 shadow-sm hover:shadow-md'}`}>
                <CardContent className="p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-display font-bold text-lg">{debt.personName}</h3>
                            <Badge variant={isPaid ? "default" : "destructive"}>{isPaid ? 'Lunas' : 'Belum Lunas'}</Badge>
                        </div>
                        {debt.description && (
                            <p className="text-sm text-muted-foreground">{debt.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-xs mt-3 text-muted-foreground">
                            <span>Dibuat: {formatDate(debt.date)}</span>
                            {debt.dueDate && <span>Jatuh Tempo: {formatDate(debt.dueDate)}</span>}
                        </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto gap-4">
                        <span className="font-display font-bold space-x-1 whitespace-nowrap text-xl">
                            {formatCurrency(debt.amount)}
                        </span>
                        <div className="flex gap-2 w-full md:w-auto items-center">
                            {!isPaid && (
                                <Button size="sm" variant="outline" className="flex-1 md:flex-none border-primary text-primary hover:bg-primary/10" onClick={() => handleMarkAsPaid(debt.id)}>
                                    <Check className="w-4 h-4 mr-1" /> Lunas
                                </Button>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost" aria-label="Opsi catatan" className="h-9 w-9">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setEditingDebt(debt)}>
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => handleDelete(debt)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Hapus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight">Utang Piutang</h1>
                    <p className="text-muted-foreground mt-1">Kelola catatan utang dan piutang Anda.</p>
                </div>
                <Button className="w-full md:w-auto shadow-lg shadow-accent/20" onClick={() => setAddSheetOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Catat Baru
                </Button>
            </div>

            <Tabs defaultValue="to_me" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="to_me">Piutang Kepadaku ({piutang.length})</TabsTrigger>
                    <TabsTrigger value="to_other">Utangku ({utang.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="to_me" className="m-0 space-y-4">
                    {piutang.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center bg-card/30 border border-dashed rounded-xl h-64">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <HelpCircle className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium">Tidak ada Piutang</h3>
                            <p className="text-sm text-muted-foreground mt-1">Anda tidak memiliki tagihan piutang aktif.</p>
                        </div>
                    ) : (
                        piutang.map(renderDebtCard)
                    )}
                </TabsContent>

                <TabsContent value="to_other" className="m-0 space-y-4">
                    {utang.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center bg-card/30 border border-dashed rounded-xl h-64">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <HelpCircle className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium">Tidak ada Utang</h3>
                            <p className="text-sm text-muted-foreground mt-1">Bagus sekali! Anda tidak memiliki kewajiban utang.</p>
                        </div>
                    ) : (
                        utang.map(renderDebtCard)
                    )}
                </TabsContent>
            </Tabs>

            {/* Add Sheet */}
            <DebtFormSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} />

            {/* Edit Sheet */}
            {editingDebt && (
                <DebtFormSheet
                    open={!!editingDebt}
                    onOpenChange={(open) => { if (!open) setEditingDebt(null); }}
                    debt={editingDebt}
                />
            )}
        </div>
    );
}
