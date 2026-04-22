// /js/admin.js - Админ панелі функциялары

class AdminPanel {
    constructor() {
        this.isAdmin = false;
        this.init();
    }

    async init() {
        // Wait for auth to resolve
        const { data: { session } } = await window._db.auth.getSession();
        let user = session?.user;
        if (!user) user = auth.getUser();
        
        // Ranks can be in metadata
        const rank = user?.user_metadata?.rank || user?.rank;
        this.isAdmin = rank === 'Админ' || rank === 'Admin';
        
        if (this.isAdmin) {
            this.setupAdminUI();
            this.loadAdminData();
        }
    }

    setupAdminUI() {
        // Админ меню пунктін қосу
        const navSection = document.querySelector('.nav-section:last-child');
        if (navSection) {
            const adminItem = document.createElement('div');
            adminItem.className = 'nav-item';
            adminItem.setAttribute('onclick', 'showPage("admin")');
            adminItem.innerHTML = `
                <i class='bx bxs-shield'></i>
                <span>Админ панелі</span>
                <span class="nav-badge" style="background: #e74c3c;">ADMIN</span>
            `;
            navSection.insertBefore(adminItem, navSection.lastElementChild);
        }

        // Админ бетін құру
        this.createAdminPage();
    }

    createAdminPage() {
        if (document.getElementById('adminPage')) return;

        const adminPage = document.createElement('div');
        adminPage.id = 'adminPage';
        adminPage.className = 'page-section';
        adminPage.innerHTML = `
            <div class="admin-container">
                <div class="admin-header">
                    <h1><i class='bx bxs-shield'></i> Админ Панелі</h1>
                    <div class="admin-stats" id="adminStats"></div>
                </div>
                
                <div class="admin-grid">
                    <div class="admin-card">
                        <h3>📚 Есептерді басқару</h3>
                        <div class="admin-actions">
                            <button class="admin-btn" onclick="adminPanel.showProblemForm()">
                                + Жаңа есеп қосу
                            </button>
                            <button class="admin-btn secondary" onclick="adminPanel.loadProblemsList()">
                                Барлық есептер
                            </button>
                        </div>
                        <div id="problemsManagement"></div>
                    </div>
                    
                    <div class="admin-card">
                        <h3>👥 Пайдаланушылар</h3>
                        <div id="usersList"></div>
                    </div>
                    
                    <div class="admin-card">
                        <h3>🏆 Турнирлер</h3>
                        <div class="admin-actions">
                            <button class="admin-btn" onclick="adminPanel.showTournamentForm()">
                                + Турнир жасау
                            </button>
                        </div>
                        <div id="tournamentsList"></div>
                    </div>
                    
                    <div class="admin-card">
                        <h3>📊 Жүйелік логтар</h3>
                        <div id="adminLogs"></div>
                    </div>
                </div>
            </div>
        `;

        document.querySelector('.main-content').appendChild(adminPage);
    }

    async loadAdminData() {
        // Платформа статистикасы
        const stats = await db.getAdminStats();
        document.getElementById('adminStats').innerHTML = `
            <div class="stat-item">
                <span class="stat-value">${stats.total_users || 0}</span>
                <span class="stat-label">Пайдаланушылар</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${stats.total_problems || 0}</span>
                <span class="stat-label">Есептер</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${stats.total_solutions || 0}</span>
                <span class="stat-label">Шешімдер</span>
            </div>
        `;
    }

    // ============ Problem Management ============

    showProblemForm(existingProblem = null) {
        const isEdit = !!existingProblem;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal admin-modal">
                <h3>${isEdit ? 'Есепті өңдеу' : 'Жаңа есеп қосу'}</h3>
                
                <form id="problemForm" class="admin-form">
                    <div class="form-group">
                        <label>Атауы (EN)</label>
                        <input type="text" name="title" value="${existingProblem?.title || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Атауы (KZ)</label>
                        <input type="text" name="title_kz" value="${existingProblem?.title_kz || ''}" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Қиындығы</label>
                            <select name="difficulty">
                                <option value="easy" ${existingProblem?.difficulty === 'easy' ? 'selected' : ''}>Оңай</option>
                                <option value="medium" ${existingProblem?.difficulty === 'medium' ? 'selected' : ''}>Орташа</option>
                                <option value="hard" ${existingProblem?.difficulty === 'hard' ? 'selected' : ''}>Қиын</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Тақырыбы</label>
                            <input type="text" name="topic" value="${existingProblem?.topic || 'Basics'}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Сипаттамасы (EN)</label>
                        <textarea name="description" rows="3" required>${existingProblem?.description || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Сипаттамасы (KZ)</label>
                        <textarea name="description_kz" rows="3" required>${existingProblem?.description_kz || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Python бастапқы коды</label>
                        <textarea name="initial_code_python" rows="4" class="code-area">${existingProblem?.initial_code_python || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>C++ бастапқы коды</label>
                        <textarea name="initial_code_cpp" rows="4" class="code-area">${existingProblem?.initial_code_cpp || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>C# бастапқы коды</label>
                        <textarea name="initial_code_csharp" rows="4" class="code-area">${existingProblem?.initial_code_csharp || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Тест кейстері (JSON)</label>
                        <textarea name="test_cases" rows="3" class="code-area">${JSON.stringify(existingProblem?.test_cases || [], null, 2)}</textarea>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="modal-btn secondary" onclick="this.closest('.modal-overlay').remove()">
                            Болдырмау
                        </button>
                        <button type="submit" class="modal-btn primary">
                            ${isEdit ? 'Сақтау' : 'Қосу'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Форма жіберу
        modal.querySelector('#problemForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            // JSON пішімдеу
            try {
                data.test_cases = JSON.parse(data.test_cases);
            } catch {
                showToast('Тест кейстері JSON форматында болуы керек', 'error');
                return;
            }

            try {
                if (isEdit) {
                    await db.adminUpdateProblem(existingProblem.id, data);
                    showToast('Есеп жаңартылды!', 'success');
                } else {
                    await db.adminCreateProblem(data);
                    showToast('Жаңа есеп қосылды!', 'success');
                }
                modal.remove();
                this.loadProblemsList();
            } catch (error) {
                showToast('Қате: ' + error.message, 'error');
            }
        });
    }

    async loadProblemsList() {
        const container = document.getElementById('problemsManagement');
        const { data: problems } = await _supabase
            .from('problems')
            .select('*')
            .order('order_index');

        container.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Атауы</th>
                        <th>Қиындығы</th>
                        <th>Тақырыбы</th>
                        <th>Күйі</th>
                        <th>Әрекеттер</th>
                    </tr>
                </thead>
                <tbody>
                    ${problems.map(p => `
                        <tr>
                            <td>${p.id}</td>
                            <td>${p.title_kz || p.title}</td>
                            <td><span class="badge ${p.difficulty}">${p.difficulty}</span></td>
                            <td>${p.topic}</td>
                            <td><span class="badge ${p.is_active ? 'active' : 'inactive'}">
                                ${p.is_active ? 'Белсенді' : 'Өшірілген'}
                            </span></td>
                            <td>
                                <button class="icon-btn" onclick="adminPanel.showProblemForm(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                                    <i class='bx bx-edit'></i>
                                </button>
                                <button class="icon-btn danger" onclick="adminPanel.toggleProblemStatus(${p.id}, ${!p.is_active})">
                                    <i class='bx bx-${p.is_active ? 'trash' : 'check'}'></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    async toggleProblemStatus(problemId, activate) {
        if (!confirm(activate ? 'Есепті белсендіру керек пе?' : 'Есепті өшіру керек пе?')) return;

        try {
            await db.adminUpdateProblem(problemId, { is_active: activate });
            showToast(activate ? 'Есеп белсендірілді' : 'Есеп өшірілді', 'success');
            this.loadProblemsList();
        } catch (error) {
            showToast('Қате: ' + error.message, 'error');
        }
    }

    // ============ Tournament Management ============

    showTournamentForm() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal admin-modal">
                <h3>Жаңа турнир</h3>
                <form id="tournamentForm" class="admin-form">
                    <div class="form-group">
                        <label>Атауы (EN)</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Атауы (KZ)</label>
                        <input type="text" name="title_kz" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Басталу уақыты</label>
                            <input type="datetime-local" name="start_time" required>
                        </div>
                        <div class="form-group">
                            <label>Аяқталу уақыты</label>
                            <input type="datetime-local" name="end_time" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Есептер ID-лері (үтірмен)</label>
                        <input type="text" name="problems_ids" placeholder="1,2,3,4,5" required>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="modal-btn secondary" onclick="this.closest('.modal-overlay').remove()">Болдырмау</button>
                        <button type="submit" class="modal-btn primary">Жасау</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#tournamentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            data.problems_ids = data.problems_ids.split(',').map(Number);
            
            try {
                await _supabase.from('tournaments').insert(data);
                showToast('Турнир жасалды!', 'success');
                modal.remove();
                this.loadTournamentsList();
            } catch (error) {
                showToast('Қате: ' + error.message, 'error');
            }
        });
    }

    async loadTournamentsList() {
        const { data: tournaments } = await _supabase
            .from('tournaments')
            .select('*')
            .order('start_time', { ascending: false });

        document.getElementById('tournamentsList').innerHTML = tournaments.map(t => `
            <div class="tournament-item ${t.status}">
                <div class="tournament-info">
                    <h4>${t.title_kz || t.title}</h4>
                    <span>${new Date(t.start_time).toLocaleString('kk-KZ')} - ${new Date(t.end_time).toLocaleString('kk-KZ')}</span>
                </div>
                <span class="badge ${t.status}">${t.status}</span>
            </div>
        `).join('');
    }
}

// Глобалды инстанс
const adminPanel = new AdminPanel();
window.adminPanel = adminPanel;