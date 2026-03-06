import { useAppStore } from '../store/useAppStore';
import { Card, CardContent } from '../components/ui/card';
import { CarFront, FileText, Pill, AlertTriangle, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { vehicles, documents, medicines, debts } = useAppStore();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 10) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    // Calculate statistics
    const totalVehicles = vehicles.length;

    // Expiry documents (Kritis or Expired) < 7 days
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const docsExpiringSoon = documents.filter((d: any) => {
        if (!d.expiryDate) return false;
        const exp = new Date(d.expiryDate);
        return exp <= nextWeek;
    }).length;

    // Medicines low stock (<= minThreshold)
    const medsLowStock = medicines.filter((m: any) => m.currentStock <= m.minThreshold).length;

    // Active Debts
    const activeDebts = debts.filter(d => d.status === 'unpaid').length;

    const totalItems = totalVehicles + documents.length + medicines.length + debts.length;

    const stats = [
        { label: 'Kendaraan', value: totalVehicles, icon: CarFront, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Dokumen Mendesak', value: docsExpiringSoon, icon: FileText, color: 'text-warning', bg: 'bg-warning/10' },
        { label: 'Obat Menipis', value: medsLowStock, icon: Pill, color: 'text-destructive', bg: 'bg-destructive/10' },
        { label: 'Utang/Piutang Aktif', value: activeDebts, icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Total Item', value: totalItems, icon: CheckCircle2, color: 'text-accent', bg: 'bg-accent/10' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <section>
                <h1 className="text-3xl font-display font-bold tracking-tight">
                    {getGreeting()}, <span className="text-accent">Admin</span> 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                    Berikut adalah ringkasan status maintenance Anda hari ini.
                </p>
            </section>

            {/* Stats Grid */}
            <motion.section
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4"
            >
                {stats.map((stat, i) => (
                    <motion.div key={i} variants={item}>
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-4 flex flex-col gap-3">
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold font-display">{stat.value}</h3>
                                    <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.section>

            {/* Perlu Perhatian */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <h2 className="text-xl font-display font-bold">Perlu Perhatian</h2>
                </div>

                {docsExpiringSoon === 0 && medsLowStock === 0 ? (
                    <Card className="border-border/50 bg-card/30 border-dashed">
                        <CardContent className="p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                            <CheckCircle2 className="w-12 h-12 text-accent/50 mb-3" />
                            <p className="font-medium text-foreground">Semua Aman</p>
                            <p className="text-sm">Tidak ada item yang memerlukan perhatian mendesak saat ini.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-3">
                        <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex items-start gap-4">
                            <div className="bg-destructive/10 p-2 rounded-full mt-1">
                                <Clock className="w-5 h-5 text-destructive" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-destructive">Terdapat Item Mendesak</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Harap periksa list notifikasi di sudut kanan atas untuk melihat lebih detail jadwal perbaikan kendaraan, dokumen kedaluwarsa, atau obat yang habis.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
