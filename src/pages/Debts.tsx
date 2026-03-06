import { useAppStore } from '../store/useAppStore';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Check, Trash2, HelpCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
// Note: We are using placeholder handlers for add, update, delete modal actions for now
// to quickly render the UI outline requested in the plan!

export default function Debts() {
    const { debts, deleteDebt, updateDebt } = useAppStore();

    const utang = debts.filter(d => d.type === 'to_other');
    const piutang = debts.filter(d => d.type === 'to_me');

    const handleMarkAsPaid = (id: string) => {
        updateDebt(id, { status: 'paid' });
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus catatan utang/piutang ini?')) {
            deleteDebt(id);
        }
    };

    const renderDebtCard = (debt: any) => {
        const isPaid = debt.status === 'paid';
        return (
            <Card key={debt.id} className={`border-border/50 relative overflow-hidden transition-all ${isPaid ? 'opacity-70 bg-card/40' : 'bg-card/80 shadow-sm hover:shadow-md'}`}>
                <CardContent className="p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-display font-bold text-lg">{debt.personName}</h3>
                            <Badge variant={isPaid ? "default" : "destructive"}>{isPaid ? 'Lunas' : 'Belum Lunas'}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{debt.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs mt-3 text-muted-foreground">
                            <span>Dibuat: {formatDate(debt.date)}</span>
                            {debt.dueDate && <span>Jatuh Tempo: {formatDate(debt.dueDate)}</span>}
                        </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto gap-4">
                        <span className="font-display font-bold space-x-1 whitespace-nowrap text-xl">
                            {formatCurrency(debt.amount)}
                        </span>
                        <div className="flex gap-2 w-full md:w-auto">
                            {!isPaid && (
                                <Button size="sm" variant="outline" className="flex-1 md:flex-none border-primary text-primary hover:bg-primary/10" onClick={() => handleMarkAsPaid(debt.id)}>
                                    <Check className="w-4 h-4 mr-1" /> Lunas
                                </Button>
                            )}
                            <Button size="icon" variant="destructive" className="h-9 w-9" onClick={() => handleDelete(debt.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
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
                <Button className="w-full md:w-auto shadow-lg shadow-accent/20">
                    <Plus className="w-4 h-4 mr-2" /> Catat Baru
                </Button>
            </div>

            <Tabs defaultValue="to_me" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="to_me">Piutang Kepadaku</TabsTrigger>
                    <TabsTrigger value="to_other">Utangku (Kewajiban)</TabsTrigger>
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
        </div>
    );
}
