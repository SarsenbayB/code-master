// --- Localization (i18n) ---
const translations = {
    kz: {
        nav_dashboard: 'Басты бет', nav_theory: 'Теория', nav_compiler: 'Компилятор',
        nav_problems: 'Есептер', nav_projects: 'Жобалар', nav_tournaments: 'Турнирлер',
        nav_rating: 'Рейтинг', nav_settings: 'Баптаулар', nav_logout: 'Шығу',
        welcome: 'Сәлем', welcome_sub: 'Бүгін керемет күн бағдарламалауды үйрену үшін!',
        stat_problems: 'Есептер', stat_xp: 'XP Ұпай', stat_streak: 'Серия (күн)',
        title_main: 'Негізгі', title_comp: 'Жарыстар', title_sys: 'Жүйе',
        card_progress: 'Жалпы Прогресс', card_daily: 'Күнделікті Тапсырма', card_achieve: 'Жетістіктер',
        settings_theme: 'Түнгі режим', settings_lang: 'Интерфейс тілі', settings_acc: 'Аккаунт аты'
    },
    ru: {
        nav_dashboard: 'Главная', nav_theory: 'Теория', nav_compiler: 'Компилятор',
        nav_problems: 'Задачи', nav_projects: 'Проекты', nav_tournaments: 'Турниры',
        nav_rating: 'Рейтинг', nav_settings: 'Настройки', nav_logout: 'Выйти',
        welcome: 'Привет', welcome_sub: 'Сегодня отличный день для программирования!',
        stat_problems: 'Задач', stat_xp: 'XP Очки', stat_streak: 'Серия (дней)',
        title_main: 'Главное', title_comp: 'Соревнования', title_sys: 'Система',
        card_progress: 'Общий Прогресс', card_daily: 'Задание дня', card_achieve: 'Достижения',
        settings_theme: 'Темный режим', settings_lang: 'Язык интерфейса', settings_acc: 'Имя аккаунта'
    }
};

window.changeLanguage = (lang) => {
    const t = translations[lang];
    if (!t) return;

    // 1. Navigation & Section Titles
    const navs = document.querySelectorAll('.nav-item span:not(.nav-badge)');
    if (navs.length >= 8) {
        navs[0].textContent = t.nav_dashboard; navs[1].textContent = t.nav_theory;
        navs[2].textContent = t.nav_compiler; navs[3].textContent = t.nav_problems;
        navs[4].textContent = t.nav_projects; navs[5].textContent = t.nav_tournaments;
        navs[6].textContent = t.nav_rating; navs[7].textContent = t.nav_settings;
    }
    const navTitles = document.querySelectorAll('.nav-title');
    if (navTitles.length >= 3) {
        navTitles[0].textContent = t.title_main;
        navTitles[1].textContent = t.title_comp;
        navTitles[2].textContent = t.title_sys;
    }

    // 2. Welcome Area
    const welcomeP = document.querySelector('.welcome-text p');
    if (welcomeP) welcomeP.textContent = t.welcome_sub;

    // 3. Card Titles
    const cardTitles = document.querySelectorAll('.card-title');
    cardTitles.forEach(el => {
        const txt = el.textContent.trim();
        if (txt.includes('Прогресс')) el.innerHTML = `<i class='bx bx-line-chart'></i> ${t.card_progress}`;
        if (txt.includes('Тапсырма')) el.innerHTML = `<i class='bx bxs-zap'></i> ${t.card_daily}`;
        if (txt.includes('Жетістіктер')) el.innerHTML = `<i class='bx bxs-award'></i> ${t.card_achieve}`;
    });

    // 4. Stats
    const stats = document.querySelectorAll('.stat-box p');
    if (stats.length >= 3) {
        stats[0].textContent = t.stat_problems;
        stats[1].textContent = t.stat_xp;
        stats[2].textContent = t.stat_streak;
    }

    // 5. Settings Labels
    const settingsHeaders = document.querySelectorAll('.setting-item h4');
    if (settingsHeaders.length >= 3) {
        settingsHeaders[0].textContent = t.settings_theme;
        settingsHeaders[1].textContent = t.settings_lang;
        settingsHeaders[2].textContent = t.settings_acc;
    }

    localStorage.setItem('preferredLang', lang);
    if (window.uiManager) window.uiManager.showToast(lang === 'kz' ? 'Тіл: Қазақша' : 'Язык: Русский', 'success');
};

// --- Global Functions (Available immediately) ---
const theoryData = {
    variables: {
        title: '📝 Айнымалылар (Variables)',
        subtitle: 'Python-да айнымалылар мәліметтерді сақтау үшін қолданылады',
        content: `<h3>Айнымалы деген не?</h3><p>Айнымалы — бұл компьютер жадында мәлімет сақтау үшін бөлінген орын.</p><div class="code-example">name = "Азамат"<br>age = 18<br>print(name)</div>`,
        quiz: {
            question: 'Python-да дұрыс айнымалы атауын таңдаңыз:',
            options: ['2user_name', 'user-name', 'user_name', 'user name'],
            correct: 2
        }
    },
    datatypes: {
        title: '🔢 Мәліметтер Типтері',
        subtitle: 'Python-да негізгі мәліметтер типтері',
        content: `<h3>Негізгі типтер:</h3><p>Python-да бірнеше негізгі типтер бар:</p><div class="code-example">x = 10      # int (бүтін сан)<br>y = 3.14    # float (ондық бөлшек)<br>s = "Hello" # str (мәтін)</div>`,
        quiz: {
            question: 'Қайсысы бүтін сан (integer) типіне жатады?',
            options: ['str', 'float', 'int', 'bool'],
            correct: 2
        }
    },
    operators: {
        title: '➗ Операторлар',
        subtitle: 'Арифметикалық операторлар',
        content: `<h3>Математикалық амалдар:</h3><div class="code-example">a = 10<br>b = 3<br>print(a + b)  # 13<br>print(a % b)  # 1 (қалдық)</div>`,
        quiz: { question: '10 // 3 нәтижесі не болады? (бүтін бөлігі)', options: ['3.33', '3', '1', '10'], correct: 1 }
    },
    conditions: {
        title: '🔀 Шарттар (if/else)',
        subtitle: 'Бағдарлама бағытын басқару',
        content: `<h3>Шартты оператор:</h3><div class="code-example">if age >= 18:<br>    print("Ересек")<br>else:<br>    print("Бала")</div>`,
        quiz: { question: 'Логикалық "және" операторы қалай жазылады?', options: ['or', 'not', 'and', '&&'], correct: 2 }
    },
    loops: {
        title: '🔄 Циклдар',
        subtitle: 'Қайталанушы әрекеттер',
        content: `<h3>for циклы:</h3><div class="code-example">for i in range(3):<br>    print("Hello")</div>`,
        quiz: { question: 'range(3) циклы неше рет орындалады?', options: ['1', '2', '3', '4'], correct: 2 }
    }
};

let userProgressData = { solvedCount: 0, xp: 0, streak: 1 };
let currentDailyProblem = null;
let selectedOption = null;

// --- Priority Functions (Must be defined before usage) ---
window.showPage = (id) => {
    console.log(">>> [UI] Showing page:", id);
    if (window.uiManager) {
        window.uiManager.showPage(id);
        if (id === 'problems') loadProblems();
        if (id === 'rating') loadLeaderboard();
        if (id === 'dashboard') loadDashboardStats();
    }
};

window.openProblemDetail = async (problemId) => {
    // Find in our combined cache (DB + fallbacks)
    const p = cachedProblems.find(x => String(x.id) === String(problemId));
    if (!p) return uiManager.showToast('Есеп табылмады', 'error');

    window.selectedProblem = p;

    const modalBody = `
        <div style="text-align:left; margin-top:15px;">
            <p style="color:var(--text-light); font-size:14px; margin-bottom:10px;"><b>Тақырып:</b> ${p.topic}</p>
            <div style="padding:15px; background:var(--bg); border-radius:12px; border:1px solid var(--border); margin-bottom:15px;">
                ${p.description || 'Бұл есеп бағдарламалау алгоритмдерін дамытуға арналған.'}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="difficulty ${p.difficulty}">${p.difficulty.toUpperCase()}</span>
                <span style="font-size:12px; color:var(--text-light)">Сыйлық: +50 XP</span>
            </div>
        </div>
    `;

    uiManager.showCustomModal(
        p.title,
        modalBody,
        'bx-code-curly',
        () => {
            window.showPage('compiler');
            setTimeout(() => {
                const ed = document.getElementById('codeEditor');
                if (ed) ed.value = `# Есеп: ${p.title}\n\n# Шарты: ${p.description || '...'}\n\n# Кодты осы жерге жазыңыз...\na = int(input())\nb = int(input())\nprint(a + b)\n`;
            }, 100);
        },
        'Шешуді бастау'
    );
};

window.openDailyDetail = () => { }; // Disabled

window.runCode = () => {
    const out = document.getElementById('outputDisplay');
    const code = document.getElementById('codeEditor').value;
    if (!out) return;

    out.textContent = ">>> Орындалуда...\n";
    out.style.color = "#0f0";

    setTimeout(() => {
        if (code.includes('print')) {
            const match = code.match(/print\((['"])(.*?)\1\)/);
            const result = match ? match[2] : "Сәтті орындалды!";
            out.textContent = `> Running python...\n${result}\n\n[Процесс аяқталды]`;
        } else {
            out.textContent = "> Running python...\n[Ескерту]: Шығыс деректері жоқ (print қолданыңыз).\n\n[Процесс аяқталды]";
        }
    }, 800);
};

window.submitCode = async () => {
    const out = document.getElementById('outputDisplay');
    const code = document.getElementById('codeEditor').value;
    const user = auth.getUser();
    const problem = window.selectedProblem || window.currentDailyProblem;

    if (!out || !user || !problem) return;

    out.textContent = ">>> Есеп тексерілуде...\n";
    out.style.color = "#3498db";

    setTimeout(async () => {
        // Simple verification: must have print and no errors
        const isCorrect = code.includes('print') && !code.toLowerCase().includes('error');

        if (isCorrect) {
            out.textContent = "> Verification passed!\n> Congratulations! You solved: " + problem.title + "\n\n+50 XP earned!";
            out.style.color = "#2ecc71";

            try {
                // Optimistic Update (Instant feedback)
                userProgressData.xp += 50;
                refreshUI();

                // Update DB (Background)
                await db.updateXP(user.id, 50);
                await db.solveProblem(user.id, problem.id);

                // Visual reward
                showXpAnimation(50);
                if (typeof confetti === 'function') {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                }

                if (window.uiManager) window.uiManager.showToast('Есеп сәтті қабылданды! +50 XP', 'success');

                // Refresh everything after a slight delay for DB consistency
                setTimeout(() => {
                    loadDashboardStats();
                    loadProblems(); // ALSO REFRESH PROBLEMS LIST
                }, 1000);
            } catch (e) {
                console.error("Submit error:", e);
                // Revert on error
                userProgressData.xp -= 50;
                refreshUI();
                if (window.uiManager) window.uiManager.showToast('Қате: ' + (e.message || 'Рұқсат жоқ'), 'error');
            }
        } else {
            out.textContent = "> Verification failed.\n> [Error]: Код нәтиже бермеді немесе 'print' қолданылмаған.\n\nЕсепті қайта қарап шығыңыз.";
            out.style.color = "#e74c3c";
            if (window.uiManager) window.uiManager.showToast('Шешім қате!', 'error');
        }
    }, 1500);
};

window.changeIDETheme = (theme) => {
    const ed = document.getElementById('codeEditor');
    if (ed) ed.className = 'code-editor ' + theme;
};

window.changeAvatar = (emoji) => {
    document.querySelectorAll('#userAvatar, #profileAvatar, #settingsAvatar').forEach(el => el.textContent = emoji);
    document.querySelectorAll('.avatar-option').forEach(opt => {
        opt.classList.toggle('active', opt.textContent === emoji);
    });
    // Store in profile metadata (future)
    if (window.uiManager) window.uiManager.showToast('Аватар жаңартылды!', 'success');
};

window.changeUsername = async () => {
    if (!window.uiManager) return;
    const newName = await window.uiManager.showPrompt('Жаңа есімді енгізіңіз:', 'Өзгерту');
    if (newName && newName.trim().length > 2) {
        const user = auth.getUser();
        if (user) {
            try {
                // Update in DB profiles table
                const { error } = await _db.from('profiles').update({ full_name: newName.trim() }).eq('id', user.id);
                if (error) throw error;

                await initUserProfile();
                window.uiManager.showToast('Есім сәтті өзгертілді!', 'success');
            } catch (e) {
                console.error(e);
                window.uiManager.showToast('Қате орын алды!', 'error');
            }
        }
    }
};

window.logout = () => auth.logout();
window.toggleTheme = () => uiManager.applyTheme(document.body.getAttribute('data-theme') !== 'dark');
window.toggleSidebar = () => document.getElementById('sidebar')?.classList.toggle('open');

let cachedProblems = [];
let cachedProjects = [];

window.handleGlobalSearch = () => {
    const query = document.getElementById('globalSearch').value.toLowerCase();
    const activePage = document.querySelector('.page-section.active').id;

    if (activePage === 'problemsPage') {
        const filtered = cachedProblems.filter(p =>
            p.title.toLowerCase().includes(query) || p.topic.toLowerCase().includes(query)
        );
        renderProblems(filtered);
    } else if (activePage === 'projectsPage' || activePage === 'dashboardPage') {
        // Universal search for project cards
        const cards = document.querySelectorAll('.project-card, .card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? 'block' : 'none';
        });
    }
};

window.filterDifficulty = (diff) => {
    // Update active UI (Atomic update)
    const filters = document.querySelectorAll('.problems-filter .panel-btn');
    filters.forEach(btn => btn.classList.toggle('active', btn.id === `p-filter-${diff}`));

    // Filter data
    if (diff === 'all') {
        renderProblems(cachedProblems);
    } else {
        const filtered = cachedProblems.filter(p => p.difficulty === diff);
        renderProblems(filtered);
    }
};

function showXpAnimation(amount) {
    const anim = document.createElement('div');
    anim.textContent = `+${amount} XP`;
    anim.style.position = 'fixed';
    anim.style.right = '50px';
    anim.style.top = '100px';
    anim.style.color = 'var(--accent)';
    anim.style.fontWeight = 'bold';
    anim.style.fontSize = '24px';
    anim.style.zIndex = '9999';
    anim.style.pointerEvents = 'none';
    anim.style.animation = 'fadeOutUp 1.5s forwards';
    document.body.appendChild(anim);
    setTimeout(() => anim.remove(), 1500);
}

// Add CSS animation for XP
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOutUp {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-100px); }
    }
`;
document.head.appendChild(style);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await window._db.auth.getSession();
    let user = session?.user;

    if (!user) {
        // Fallback for auth state delay
        user = auth.getUser();
    }

    if (!user) return window.location.href = 'index.html';

    auth.currentUser = user;

    console.log(">>> [UI] Initializing ultra-fast dashboard...");

    try {
        // Essential setup first
        await db.ensureProfileExists(user);

        // Concurrent loading (Fast!)
        Promise.all([
            initUserProfile(),
            loadDashboardStats(),
            loadProblems(),
            loadLeaderboard()
        ]);

        showTheoryTopic('variables');
    } catch (e) {
        console.error("Dashboard init error:", e);
    }
});

async function initUserProfile() {
    const user = auth.getUser();
    if (!user) return;
    const profile = await db.getProfile(user.id);
    const name = profile?.full_name || user.user_metadata?.full_name || user.email;
    document.querySelectorAll('#userName, #profileName, #currentUsername, #settingsUserName').forEach(el => el.textContent = name);
    const welcome = document.getElementById('welcomeMessage');
    if (welcome) welcome.textContent = `Сәлем, ${name.split(' ')[0]}! 👋`;
    const initials = name.charAt(0).toUpperCase();
    document.querySelectorAll('#userAvatar, #profileAvatar').forEach(el => el.textContent = initials);
}

async function loadDashboardStats() {
    console.log(">>> [Backend] Fetching stats from Supabase...");
    const user = auth.getUser();
    if (!user) return;
    try {
        const profile = await db.getProfile(user.id);
        const solvedCount = await db.getSolvedCount(user.id);
        console.log(">>> [Backend] Stats received:", { xp: profile?.xp, solved: solvedCount });
        userProgressData = { solvedCount: solvedCount || 0, xp: profile?.xp || 0, streak: profile?.streak_days || 1 };
        refreshUI();
    } catch (e) { console.error(">>> [Backend] Fetch error:", e); }
}

function refreshUI() {
    const d = userProgressData;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('solvedCount', d.solvedCount);
    set('statPoints', d.xp);
    set('streakCount', d.streak);

    // Progress Bars Calc
    const xpPercent = Math.min((d.xp % 500) / 500 * 100, 100);
    const solvedPercent = Math.min((d.solvedCount / 20) * 100, 100); // Target 20 problems

    const xpFill = document.getElementById('xpProgress');
    const solvedFill = document.getElementById('solvedProgress');

    if (xpFill) xpFill.style.width = `${xpPercent}%`;
    if (solvedFill) solvedFill.style.width = `${solvedPercent}%`;

    // Add settings page sync
    set('settingsXPDisplay', d.xp);
    const level = Math.floor(d.xp / 500) + 1;
    document.querySelectorAll('.user-level').forEach(el => el.textContent = `Level ${level} • ${d.xp} XP`);
}

// --- Data Loading ---
window.showTheoryTopic = (topic) => {
    const data = theoryData[topic];
    if (!data) return;
    selectedOption = null;
    document.querySelectorAll('.theory-nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick')?.includes(`'${topic}'`)) item.classList.add('active');
    });
    const body = document.getElementById('theoryBody');
    if (body) body.innerHTML = `<h2>${data.title}</h2><p>${data.subtitle}</p>${data.content}`;
    const qText = document.getElementById('quizQuestion');
    const qOptions = document.getElementById('quizOptions');
    if (qText && qOptions) {
        qText.textContent = data.quiz.question;
        qOptions.innerHTML = data.quiz.options.map((opt, i) => `
            <div class="theory-nav-item quiz-opt" style="border:1px solid var(--border); margin:0;" onclick="selectTheoryOption(${i})">
                ${String.fromCharCode(65 + i)}) ${opt}
            </div>
        `).join('') + `
            <button class="panel-btn" style="width:100%; margin-top:15px; background:var(--accent)" onclick="checkTheoryAnswer('${topic}')">Тексеру</button>
        `;
    }
};

window.selectTheoryOption = (index) => {
    selectedOption = index;
    document.querySelectorAll('.quiz-opt').forEach((opt, i) => {
        opt.style.background = i === index ? 'var(--primary)' : '';
        opt.style.color = i === index ? 'white' : '';
    });
};

window.checkTheoryAnswer = async (topicKey) => {
    if (selectedOption === null) return uiManager.showToast('🤔 Алдымен жауапты таңдаңыз!', 'info');
    const user = auth.getUser();
    const correct = theoryData[topicKey].quiz.correct;
    const opts = document.querySelectorAll('.quiz-opt');

    if (selectedOption === correct) {
        opts[selectedOption].style.background = 'var(--success)';
        uiManager.showToast('✅ Керемет! +10 XP', 'success');
        if (user) {
            showXpAnimation(10);
            await db.updateXP(user.id, 10);
            setTimeout(loadDashboardStats, 500);
        }
    } else {
        opts[selectedOption].style.background = 'var(--danger)';
        opts[correct].style.background = 'var(--success)';
        opts[correct].color = 'white';
        uiManager.showToast('❌ Қате!', 'error');
    }
    document.querySelectorAll('.quiz-opt').forEach(opt => opt.onclick = null);
};

// --- Other Data Loading ---
const fallbackProblems = [
    { id: 1, title: 'Екі санның қосындысы', topic: 'Негіздер', difficulty: 'easy' },
    { id: 2, title: 'Факториалды есептеу', topic: 'Циклдар', difficulty: 'medium' },
    { id: 3, title: 'Палиндромды тексеру', topic: 'Мәтіндер', difficulty: 'medium' },
    { id: 4, title: 'Максимум табу', topic: 'Массивтер', difficulty: 'easy' },
    { id: 5, title: 'Фибоначчи сандары', topic: 'Рекурсия', difficulty: 'hard' },
    { id: 6, title: 'Жай сандар тізімі', topic: 'Математика', difficulty: 'medium' },
    { id: 7, title: 'Сөз санын санау', topic: 'Мәтіндер', difficulty: 'easy' },
    { id: 8, title: 'Көбейту кестесі', topic: 'Циклдар', difficulty: 'easy' },
    { id: 9, title: 'Тізімді кері айналдыру', topic: 'Массивтер', difficulty: 'medium' },
    { id: 10, title: 'Жұп сандар қосындысы', topic: 'Циклдар', difficulty: 'easy' },
    { id: 11, title: 'Дәрежені есептеу (A^B)', topic: 'Математика', difficulty: 'medium' },
    { id: 12, title: 'Символды іздеу', topic: 'Мәтіндер', difficulty: 'easy' },
    { id: 13, title: 'Квадрат теңдеу', topic: 'Математика', difficulty: 'hard' },
    { id: 14, title: 'Анаграммаларды анықтау', topic: 'Мәтіндер', difficulty: 'hard' },
    { id: 15, title: 'Орташа арифметикалық', topic: 'Массивтер', difficulty: 'medium' },
    { id: 16, title: 'Ең үлкен ортақ бөлгіш', topic: 'Математика', difficulty: 'medium' },
    { id: 17, title: 'QuickSort алгоритмі', topic: 'Алгоритмдер', difficulty: 'hard' },
    { id: 18, title: 'Бинарлы іздеу', topic: 'Алгоритмдер', difficulty: 'medium' },
    { id: 19, title: 'Матрицаны бұру', topic: 'Матрицалар', difficulty: 'hard' },
    { id: 20, title: 'Сөзді кері жазу', topic: 'Мәтіндер', difficulty: 'easy' }
];

async function loadProblems() {
    const list = document.getElementById('allProblemsList');
    const user = auth.getUser();
    if (!list || !user) return;
    try {
        const [dbProblems, solvedIds] = await Promise.all([
            db.getProblems(),
            db.getSolvedProblemIds(user.id)
        ]);

        // Merge DB problems with fallback to ensure we have content
        let problems = [...dbProblems];
        if (problems.length < 20) {
            const existingIds = new Set(problems.map(p => Number(p.id)));
            fallbackProblems.forEach(fp => {
                if (!existingIds.has(Number(fp.id)) && problems.length < 20) {
                    problems.push(fp);
                }
            });
        }

        cachedProblems = problems;
        window.userSolvedIds = solvedIds;
        renderProblems(problems);
    } catch (e) { console.error(e); }
}

function renderProblems(problems) {
    const list = document.getElementById('allProblemsList');
    const badge = document.getElementById('problemsBadge');
    const solvedIds = window.userSolvedIds || [];

    if (badge) badge.textContent = problems.length;

    if (problems.length === 0) {
        list.innerHTML = `<p style="grid-column: 1/-1; padding: 20px; color: var(--text-light)">Ештеңе табылмады...</p>`;
        return;
    }

    list.innerHTML = problems.map(p => {
        const isSolved = solvedIds.some(sid => String(sid) === String(p.id));
        return `
            <div class="problem-item ${isSolved ? 'solved' : ''}" data-difficulty="${p.difficulty}" onclick="window.openProblemDetail('${p.id}')">
                <div class="problem-info">
                    ${isSolved ? "<i class='bx bxs-check-circle'></i>" : "<i class='bx bx-circle'></i>"}
                    <div style="text-align:left">
                        <div class="problem-name">${p.title}</div>
                        <div class="problem-topic">${p.topic}</div>
                    </div>
                </div>
                <span class="difficulty ${p.difficulty}">${p.difficulty}</span>
            </div>
        `;
    }).join('');
}

async function loadLeaderboard() {
    const list = document.querySelector('.leaderboard-list');
    if (!list) return;
    try {
        const players = await db.getLeaderboard(10);
        list.innerHTML = players.map((p, i) => `
            <div class="leaderboard-item">
                <div class="rank-badge rank-${i < 3 ? i + 1 : 'other'}">${i + 1}</div>
                <div class="leader-info"><div class="leader-name">${p.full_name}</div><div class="leader-xp">${p.xp} XP</div></div>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}