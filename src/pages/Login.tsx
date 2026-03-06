import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User, Lock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
    const { login } = useAuthStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;

        setIsLoading(true);
        const success = await login(username, password);
        setIsLoading(false);

        if (success) {
            toast.success('Login berhasil', { description: 'Selamat datang kembali di LifeKeep.' });
        } else {
            toast.error('Login gagal', { description: 'Username atau password yang Anda masukkan salah.' });
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden noise-texture">
            {/* Decorative background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

            <div className="w-full max-w-sm z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col items-center mb-8 gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center shadow-xl shadow-accent/20">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="font-display text-3xl font-bold tracking-tight">LifeKeep</h1>
                    <p className="text-muted-foreground text-sm">Personal Maintenance Dashboard</p>
                </div>

                <Card className="border-border/50 shadow-2xl backdrop-blur-xl bg-card/80">
                    <CardHeader>
                        <CardTitle>Login Administrator</CardTitle>
                        <CardDescription>
                            Masukkan password untuk mengakses LifeKeep.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2 relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Username..."
                                    className="pl-10 h-12"
                                    value={username}
                                    onChange={(e: any) => setUsername(e.target.value)}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2 relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="Password..."
                                    className="pl-10 h-12"
                                    value={password}
                                    onChange={(e: any) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-md font-medium" disabled={isLoading || !username || !password}>
                                {isLoading ? 'Memverifikasi...' : 'Masuk'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
