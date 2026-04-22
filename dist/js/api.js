/**
 * js/api.js - Supabase Database Interface
 */
const supabaseUrl = 'https://pqzmkluncqflgypuuawl.supabase.co';
const supabaseKey = 'sb_publishable_Q-jK2a25APv5q69vB3FtaQ_kU8w4pPw';
const _db = supabase.createClient(supabaseUrl, supabaseKey);

const db = {
    // === Profile Management ===
    async getProfile(userId) {
        if (!userId) return null;
        const { data, error } = await _db.from('profiles').select('*').eq('id', userId).maybeSingle();
        if (error) console.error("Profile fetch error:", error);
        return data;
    },

    async ensureProfileExists(user) {
        if (!user) return;
        const profile = await this.getProfile(user.id);
        if (!profile) {
            const { error } = await _db.from('profiles').insert([{
                id: user.id,
                full_name: user.user_metadata?.full_name || user.email.split('@')[0],
                xp: 0,
                streak_days: 1
            }]);
            if (error) console.error("Profile creation error:", error);
        }
    },

    async updateXP(userId, additionalXp) {
        if (!userId) return;
        // Fetch fresh profile right before update to prevent race conditions
        const { data: profile, error: fError } = await _db.from('profiles').select('xp').eq('id', userId).single();
        if (fError) throw fError;

        const newXp = (profile.xp || 0) + additionalXp;
        const { error: uError } = await _db.from('profiles').update({ xp: newXp }).eq('id', userId);

        if (uError) {
            console.error(">>> [Backend] XP Update Error:", uError);
            if (window.uiManager) window.uiManager.showToast('XP сақтау қатесі: ' + uError.message, 'error');
            throw uError;
        }
        console.log(`>>> [Backend] XP successfully updated to: ${newXp}`);
        return newXp;
    },

    // === Problems ===
    async getProblems() {
        const { data, error } = await _db.from('problems').select('*').order('id', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async getSolvedCount(userId) {
        const { count, error } = await _db.from('user_problems')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
        if (error) return 0;
        return count || 0;
    },

    async getSolvedProblemIds(userId) {
        if (!userId) return [];
        let solved = [];
        try {
            const { data, error } = await _db.from('user_problems').select('problem_id').eq('user_id', userId);
            if (!error && data) solved = data.map(x => String(x.problem_id));
        } catch (e) { console.error(e); }

        // Local Storage Fallback for instant UI
        const localSolved = JSON.parse(localStorage.getItem(`solved_${userId}`) || "[]");
        return [...new Set([...solved, ...localSolved.map(String)])];
    },

    async solveProblem(userId, problemId) {
        console.log(`>>> [Backend] Marking problem ${problemId} as solved...`);

        // Update Local Storage for instant feedback
        const localKey = `solved_${userId}`;
        const localSolved = JSON.parse(localStorage.getItem(localKey) || "[]");
        if (!localSolved.includes(String(problemId))) {
            localSolved.push(String(problemId));
            localStorage.setItem(localKey, JSON.stringify(localSolved));
        }

        const { error } = await _db.from('user_problems')
            .insert([{ user_id: userId, problem_id: Number(problemId) }]);

        if (error && error.code !== '23505') {
            console.error(">>> [Backend] solveProblem DB Error:", error);
        }
    },

    // === Leaderboard ===
    async getLeaderboard(limit = 10) {
        const { data, error } = await _db.from('profiles')
            .select('full_name, xp')
            .order('xp', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data || [];
    }
};

window.db = db;
window._db = _db;
