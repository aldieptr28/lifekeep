import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    isAuthenticated: boolean;
    user: { username: string } | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const TARGET_HASH = 'ab5246bbad7de04b465c9dfcde77c26c2e1b80200ffbcc336965ae86360ebe5f';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            login: async (username: string, password: string) => {
                try {
                    // Specific requirement: must be admin user
                    if (username.toLowerCase() !== 'admin') {
                        return false;
                    }

                    const encoder = new TextEncoder();
                    const data = encoder.encode(password);
                    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                    if (hashHex === TARGET_HASH) {
                        set({ isAuthenticated: true, user: { username } });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Login hash failed:", error);
                    return false;
                }
            },
            logout: () => set({ isAuthenticated: false, user: null }),
        }),
        {
            name: 'auth-session',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
