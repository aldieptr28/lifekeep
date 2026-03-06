import type { Vehicle, DocumentItem, Medicine, Debt } from '../types';

export const sampleVehicles: Vehicle[] = [
    {
        id: 'v1',
        name: 'Honda Vario 150',
        type: 'Motor',
        year: '2020',
        plateNumber: 'B 1234 ABC',
        currentKm: 15400,
        color: '#00E5A0',
        maintenanceItems: [
            {
                id: 'm1',
                name: 'Ganti Oli Mesin',
                kmInterval: 2000,
                monthInterval: 3,
                lastDoneDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
                lastDoneKm: 14000,
            },
            {
                id: 'm2',
                name: 'Ganti Kampas Rem',
                kmInterval: 10000,
                monthInterval: 12,
                lastDoneDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
                lastDoneKm: 8000,
            }
        ],
        history: []
    },
    {
        id: 'v2',
        name: 'Toyota Avanza',
        type: 'Mobil',
        year: '2018',
        plateNumber: 'D 5678 EFG',
        currentKm: 45000,
        color: '#FF6B35',
        maintenanceItems: [
            {
                id: 'm3',
                name: 'Servis Berkala 10rb',
                kmInterval: 10000,
                monthInterval: 6,
                lastDoneDate: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000).toISOString(), // Almost 6 months ago
                lastDoneKm: 35000,
            }
        ],
        history: []
    }
];

export const sampleDocuments: DocumentItem[] = [
    {
        id: 'd1',
        type: 'SIM C',
        ownerName: 'Admin',
        documentNumber: '12345678901234',
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Expires in 5 days (KRITIS)
        reminderDays: [30, 14, 7, 1],
        notes: 'Perpanjang di Satpas Daan Mogot',
        history: []
    },
    {
        id: 'd2',
        type: 'STNK Avanza',
        ownerName: 'Admin',
        expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // Expires in 25 days (PERHATIAN)
        reminderDays: [30, 14, 7, 1],
        notes: 'Pajak tahunan',
        history: []
    },
    {
        id: 'd3',
        type: 'Paspor',
        ownerName: 'Admin',
        expiryDate: new Date(Date.now() + 800 * 24 * 60 * 60 * 1000).toISOString(), // Aman
        reminderDays: [180, 90, 30],
        notes: 'Aman untuk 2 tahun lagi',
        history: []
    }
];

export const sampleMedicines: Medicine[] = [
    {
        id: 'med1',
        name: 'Paracetamol 500mg',
        category: 'P3K',
        currentStock: 4,
        unit: 'Tablet',
        minThreshold: 10,
        purchaseDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Untuk pusing kepala',
        logs: []
    },
    {
        id: 'med2',
        name: 'Vitamin C 1000mg',
        category: 'Vitamin',
        currentStock: 30,
        unit: 'Tube',
        minThreshold: 5,
        purchaseDate: new Date().toISOString(),
        notes: 'Diminum setiap pagi',
        logs: []
    }
];

export const sampleDebts: Debt[] = [
    {
        id: 'debt1',
        type: 'to_me',
        personName: 'Budi (Sample)',
        amount: 500000,
        description: 'Pinjam untuk bayar kos',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'unpaid',
        logs: []
    },
    {
        id: 'debt2',
        type: 'to_other',
        personName: 'Siti (Sample)',
        amount: 250000,
        description: 'Talangan makan siang bersama',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'unpaid',
        logs: []
    }
];