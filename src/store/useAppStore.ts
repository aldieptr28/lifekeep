import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../lib/idb-storage';
import type { Vehicle, DocumentItem, Medicine, AppNotification, Debt } from '../types';
import { sampleVehicles, sampleDocuments, sampleMedicines, sampleDebts } from '../lib/sampleData';

interface AppState {
    vehicles: Vehicle[];
    documents: DocumentItem[];
    medicines: Medicine[];
    debts: Debt[];
    notifications: AppNotification[];
    hasHydrated: boolean;

    // Actions
    setHasHydrated: (state: boolean) => void;

    // Vehicles CRUD
    addVehicle: (vehicle: Vehicle) => void;
    updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
    deleteVehicle: (id: string) => void;

    // Documents CRUD
    addDocument: (doc: DocumentItem) => void;
    updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
    deleteDocument: (id: string) => void;

    // Medicine CRUD
    addMedicine: (med: Medicine) => void;
    updateMedicine: (id: string, updates: Partial<Medicine>) => void;
    deleteMedicine: (id: string) => void;

    // Debts CRUD
    addDebt: (debt: Debt) => void;
    updateDebt: (id: string, updates: Partial<Debt>) => void;
    deleteDebt: (id: string) => void;

    // Notifications
    addNotification: (notification: AppNotification) => void;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;

    // History/Log delete actions
    deleteVehicleHistoryEntry: (vehicleId: string, historyId: string) => void;
    deleteMedicineLog: (medicineId: string, logId: string) => void;
    deleteDocumentHistory: (docId: string, historyId: string) => void;
    clearAllHistory: () => void;

    // Reset/Load
    loadSampleData: () => void;
    importData: (data: Partial<AppState>) => void;
    generateAlerts: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            vehicles: [],
            documents: [],
            medicines: [],
            debts: [],
            notifications: [],
            hasHydrated: false,

            setHasHydrated: (state) => set({ hasHydrated: state }),

            addVehicle: (vehicle) =>
                set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
            updateVehicle: (id, updates) =>
                set((state) => ({
                    vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v)),
                })),
            deleteVehicle: (id) =>
                set((state) => ({ vehicles: state.vehicles.filter((v) => v.id !== id) })),

            addDocument: (doc) =>
                set((state) => ({ documents: [...state.documents, doc] })),
            updateDocument: (id, updates) =>
                set((state) => ({
                    documents: state.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
                })),
            deleteDocument: (id) =>
                set((state) => ({ documents: state.documents.filter((d) => d.id !== id) })),

            addMedicine: (med) =>
                set((state) => ({ medicines: [...state.medicines, med] })),
            updateMedicine: (id, updates) =>
                set((state) => ({
                    medicines: state.medicines.map((m) => (m.id === id ? { ...m, ...updates } : m)),
                })),
            deleteMedicine: (id) =>
                set((state) => ({ medicines: state.medicines.filter((m) => m.id !== id) })),

            addDebt: (debt) =>
                set((state) => ({ debts: [...state.debts, debt] })),
            updateDebt: (id, updates) =>
                set((state) => ({
                    debts: state.debts.map((d) => (d.id === id ? { ...d, ...updates } : d)),
                })),
            deleteDebt: (id) =>
                set((state) => ({ debts: state.debts.filter((d) => d.id !== id) })),

            deleteVehicleHistoryEntry: (vehicleId, historyId) =>
                set((state) => ({
                    vehicles: state.vehicles.map((v) =>
                        v.id === vehicleId
                            ? { ...v, history: v.history.filter((h) => h.id !== historyId) }
                            : v
                    ),
                })),
            deleteMedicineLog: (medicineId, logId) =>
                set((state) => ({
                    medicines: state.medicines.map((m) =>
                        m.id === medicineId
                            ? { ...m, logs: m.logs.filter((l) => l.id !== logId) }
                            : m
                    ),
                })),
            deleteDocumentHistory: (docId, historyId) =>
                set((state) => ({
                    documents: state.documents.map((d) =>
                        d.id === docId
                            ? { ...d, history: (d.history || []).filter((h) => h.id !== historyId) }
                            : d
                    ),
                })),
            clearAllHistory: () =>
                set((state) => ({
                    vehicles: state.vehicles.map((v) => ({ ...v, history: [] })),
                    medicines: state.medicines.map((m) => ({ ...m, logs: [] })),
                    documents: state.documents.map((d) => ({ ...d, history: [] })),
                })),

            addNotification: (notif) =>
                set((state) => ({
                    notifications: [notif, ...state.notifications],
                })),
            markNotificationAsRead: (id) =>
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, isRead: true } : n
                    ),
                })),
            markAllNotificationsAsRead: () =>
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                })),

            loadSampleData: () =>
                set({
                    vehicles: sampleVehicles,
                    documents: sampleDocuments,
                    medicines: sampleMedicines,
                    debts: sampleDebts,
                    notifications: [],
                }),

            importData: (data) =>
                set((state) => ({
                    ...state,
                    ...data,
                })),

            generateAlerts: () => set((state) => {
                const newNotifications: AppNotification[] = [];
                const now = new Date();

                // Vehicle Alerts
                state.vehicles.forEach(v => {
                    v.maintenanceItems.forEach(item => {
                        const kmProgress = v.currentKm - item.lastDoneKm;
                        const progressPercentage = (kmProgress / item.kmInterval) * 100;
                        if (progressPercentage >= 90) {
                            if (!state.notifications.some(n => n.itemId === item.id && !n.isRead)) {
                                newNotifications.push({
                                    id: crypto.randomUUID(),
                                    moduleId: 'vehicles',
                                    itemId: item.id,
                                    title: `Servis Kendaraan: ${v.name}`,
                                    description: `${item.name} sudah mendekati atau melewati batas KM.`,
                                    timestamp: new Date().toISOString(),
                                    isRead: false,
                                    severity: progressPercentage >= 100 ? 'danger' : 'warning'
                                });
                            }
                        }
                    });
                });

                // Document Alerts
                state.documents.forEach(d => {
                    if (d.expiryDate) {
                        const daysLeft = Math.ceil((new Date(d.expiryDate).getTime() - now.getTime()) / (1000 * 3600 * 24));
                        if (daysLeft <= 30) {
                            if (!state.notifications.some(n => n.itemId === d.id && !n.isRead)) {
                                newNotifications.push({
                                    id: crypto.randomUUID(),
                                    moduleId: 'documents',
                                    itemId: d.id,
                                    title: `Dokumen: ${d.type}`,
                                    description: daysLeft < 0 ? `Dokumen telah kedaluwarsa!` : `Masa berlaku akan habis dalam ${daysLeft} hari.`,
                                    timestamp: new Date().toISOString(),
                                    isRead: false,
                                    severity: daysLeft < 0 ? 'danger' : 'warning'
                                });
                            }
                        }
                    }
                });

                // Medicine Alerts
                state.medicines.forEach(m => {
                    if (m.currentStock <= m.minThreshold) {
                        if (!state.notifications.some(n => n.itemId === m.id && !n.isRead)) {
                            newNotifications.push({
                                id: crypto.randomUUID(),
                                moduleId: 'medicine',
                                itemId: m.id,
                                title: `Stok Menipis: ${m.name}`,
                                description: m.currentStock === 0 ? `Stok habis!` : `Sisa stok hanya ${m.currentStock}. Segera restock.`,
                                timestamp: new Date().toISOString(),
                                isRead: false,
                                severity: m.currentStock === 0 ? 'danger' : 'warning'
                            });
                        }
                    }
                });

                // Debt Alerts
                state.debts.forEach(d => {
                    if (d.status === 'unpaid' && d.dueDate) {
                        const daysLeft = Math.ceil((new Date(d.dueDate).getTime() - now.getTime()) / (1000 * 3600 * 24));
                        if (daysLeft <= 3) {
                            if (!state.notifications.some(n => n.itemId === d.id && !n.isRead)) {
                                const typeLabel = d.type === 'to_me' ? 'Piutang' : 'Utang';
                                newNotifications.push({
                                    id: crypto.randomUUID(),
                                    moduleId: 'debts',
                                    itemId: d.id,
                                    title: `${typeLabel} Jatuh Tempo: ${d.personName}`,
                                    description: daysLeft < 0 ? `${typeLabel} telah lewat jatuh tempo!` : `Akan jatuh tempo dalam ${daysLeft} hari.`,
                                    timestamp: new Date().toISOString(),
                                    isRead: false,
                                    severity: daysLeft < 0 ? 'danger' : 'warning'
                                });
                            }
                        }
                    }
                });

                return { notifications: [...newNotifications, ...state.notifications] };
            }),
        }),
        {
            name: 'lifekeep-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => idbStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
