/**
 * js/auth.js - Returning to Supabase Auth (Email + Password)
 * WITHOUT email confirmation requirement.
 */
class CustomAuth {
    constructor() {
        this.sessionKey = 'sb_session_data';
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Restore session from Supabase
        const { data: { session } } = await _db.auth.getSession();
        this.currentUser = session?.user || null;

        // Listen for auth changes
        _db.auth.onAuthStateChange((event, session) => {
            this.currentUser = session?.user || null;
            this.checkProtection();
        });

        this.checkProtection();
    }

    // --- Core Actions ---

    async register(email, password, fullName) {
        if (!email || !password || !fullName) throw new Error("Барлық өрістерді толтырыңыз.");

        // 1. Supabase Auth Registration
        const { data, error } = await _db.auth.signUp({
            email: email.trim(),
            password: password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });

        if (error) throw error;
        if (!data.user) throw new Error("Тіркелу кезінде қате кетті.");

        return data.user;
    }

    async login(email, password) {
        if (!email || !password) throw new Error("Email мен парольді енгізіңіз.");

        const { data, error } = await _db.auth.signInWithPassword({
            email: email.trim(),
            password: password
        });

        if (error) throw error;
        return data.user;
    }

    // --- Helpers ---

    async logout() {
        await _db.auth.signOut();
        window.location.href = 'index1.html';
    }

    checkProtection() {
        const path = window.location.pathname;
        const isDashboard = path.includes('dashboard.html');
        // Тек index1.html (кіру/тіркелу беті) бағытталады — register1.html ЕМЕС
        const isLoginPage = path.includes('index1.html');

        if (isDashboard && !this.currentUser) {
            window.location.href = 'index1.html';
        } else if (isLoginPage && this.currentUser) {
            window.location.href = 'dashboard.html';
        }
    }

    getUser() {
        if (!this.currentUser) return null;
        return {
            id: this.currentUser.id,
            email: this.currentUser.email,
            full_name: this.currentUser.user_metadata?.full_name || 'Пайдаланушы'
        };
    }
}

window.auth = new CustomAuth();