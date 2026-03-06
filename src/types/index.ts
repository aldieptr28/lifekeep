export type VehicleType = 'Motor' | 'Mobil' | 'Sepeda' | 'Truk';

export interface MaintenanceItem {
    id: string;
    name: string;
    kmInterval: number; // e.g. 2000
    monthInterval: number; // e.g. 3
    lastDoneDate: string; // ISO string
    lastDoneKm: number;
}

export interface ServiceHistory {
    id: string;
    maintenanceItemId: string;
    maintenanceItemName: string;
    date: string; // ISO string
    km: number;
    cost: number;
    workshop: string;
    notes: string;
}

export interface Vehicle {
    id: string;
    name: string;
    type: VehicleType;
    year: string;
    plateNumber?: string;
    currentKm: number;
    color?: string;
    maintenanceItems: MaintenanceItem[];
    history: ServiceHistory[];
}

export type DocStatus = 'EXPIRED' | 'KRITIS' | 'PERHATIAN' | 'AMAN' | 'NO_EXPIRY';

export interface DocumentItem {
    id: string;
    type: string; // SIM A, STNK, dll
    ownerName: string;
    documentNumber?: string;
    expiryDate?: string; // ISO string
    reminderDays: number[]; // e.g. [30, 14, 7, 1]
    notes: string;
    history: DocumentHistory[];
}

export interface DocumentHistory {
    id: string;
    date: string;
    notes: string;
}

export type MedicineCategory = 'Obat Rutin' | 'Vitamin' | 'P3K' | 'Suplemen';
export type MedicineUnit = 'Tablet' | 'Kapsul' | 'Botol' | 'Sachet' | 'Strip' | 'Tube';

export interface Medicine {
    id: string;
    name: string;
    category: MedicineCategory;
    currentStock: number;
    unit: MedicineUnit;
    minThreshold: number;
    purchaseDate: string; // ISO
    expiryDate?: string; // ISO
    notes: string;
    logs: MedicineLog[];
}

export interface MedicineLog {
    id: string;
    type: 'IN' | 'OUT';
    qty: number;
    date: string;
    notes?: string;
    cost?: number; // only for IN
}

export interface AppNotification {
    id: string;
    moduleId: 'vehicles' | 'documents' | 'medicine' | 'debts';
    itemId: string;
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
    severity: 'danger' | 'warning' | 'info';
}

export type DebtType = 'to_me' | 'to_other'; // to_me = Piutang, to_other = Utang
export type DebtStatus = 'unpaid' | 'paid';

export interface Debt {
    id: string;
    type: DebtType;
    personName: string;
    amount: number;
    description: string;
    date: string; // ISO String (when debt created)
    dueDate?: string; // ISO String
    status: DebtStatus;
    logs: DebtLog[];
}

export interface DebtLog {
    id: string;
    date: string; // ISO string
    amountPaid: number;
    notes?: string;
}
