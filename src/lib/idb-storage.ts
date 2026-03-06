import { openDB } from 'idb';
import type { StateStorage } from 'zustand/middleware';

const dbName = 'lifekeep-db';
const storeName = 'zustand-store';

const initDB = async () => {
    return openDB(dbName, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        },
    });
};

export const idbStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        const db = await initDB();
        const value = await db.get(storeName, name);
        return value || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        const db = await initDB();
        await db.put(storeName, value, name);
    },
    removeItem: async (name: string): Promise<void> => {
        const db = await initDB();
        await db.delete(storeName, name);
    },
};
