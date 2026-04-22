/**
 * js/main.js - Global UI Manager
 * Handles navigation, themes, and common UI elements
 */

class UIManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupTheme();
        this.setupGlobalShortcuts();

        // Expose critical functions globally
        window.showPage = (name) => this.showPage(name);
        window.showToast = this.showToast.bind(this);
    }

    // ============ Navigation ============

    showPage(pageName) {
        console.log('Navigating to:', pageName);

        // 1. Hide all pages
        const pages = document.querySelectorAll('.page-section');
        pages.forEach(p => p.classList.remove('active'));

        // 2. Show target page
        const target = document.getElementById(pageName + 'Page');
        if (target) {
            target.classList.add('active');
            window.scrollTo(0, 0);
        } else {
            console.warn(`Page ${pageName}Page not found!`);
        }

        // 3. Update Sidebar Active State
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            // Check if onclick contains the page name
            const onclick = item.getAttribute('onclick');
            if (onclick && onclick.includes(`'${pageName}'`)) {
                item.classList.add('active');
            }
        });

        // 4. Close mobile sidebar if open
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');

        // 5. Context specific loading
        if (pageName === 'problems') this.loadProblemsPage();
    }

    // ============ Mobile Menu ============

    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-toggle');
        const sidebar = document.getElementById('sidebar');

        if (toggle && sidebar) {
            toggle.onclick = () => {
                sidebar.classList.toggle('open');
            };
        }
    }

    // ============ Theme ============

    setupTheme() {
        const savedTheme = localStorage.getItem('darkTheme') === 'true';
        this.applyTheme(savedTheme);
    }

    applyTheme(isDark) {
        document.body.setAttribute('data-theme', isDark ? 'dark' : '');
        localStorage.setItem('darkTheme', isDark);

        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.classList.toggle('active', isDark);

        const icon = document.getElementById('themeIcon');
        if (icon) icon.className = isDark ? 'bx bx-sun' : 'bx bx-moon';
    }

    // ============ Toasts ============

    showToast(message, type = 'success') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'bx-check-circle',
            error: 'bx-error-circle',
            info: 'bx-info-circle'
        };

        toast.innerHTML = `
            <i class='bx ${icons[type] || icons.success}'></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);
        setTimeout(() => toast.classList.add('active'), 10);

        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ============ Global Helpers ============

    setupGlobalShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'b') {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) sidebar.classList.toggle('open');
            }
        });
    }

    async loadProblemsPage() {
        const list = document.getElementById('allProblemsList');
        if (list && !list.dataset.loaded) {
            // Load problems from db
            try {
                const problems = await db.getProblems();
                list.innerHTML = problems.map(p => this.createProblemHTML(p)).join('');
                list.dataset.loaded = 'true';
            } catch (err) {
                console.error('Failed to load problems:', err);
            }
        }
    }

    showCustomModal(title, content, icon = '💬', onConfirm = null, confirmText = 'Растау') {
        const modal = document.getElementById('customModal');
        const mTitle = document.getElementById('modalTitle');
        const mText = document.getElementById('modalText');
        const mIcon = document.getElementById('modalIcon');
        const mConfirmBtn = document.getElementById('modalConfirmBtn');
        const mInputCont = document.getElementById('modalInputContainer');

        if (!modal) return;

        mTitle.textContent = title;
        mText.innerHTML = content; // Allows HTML content
        if (mIcon) mIcon.textContent = icon;
        if (mInputCont) mInputCont.style.display = 'none';

        mConfirmBtn.textContent = confirmText;
        mConfirmBtn.onclick = () => {
            modal.classList.remove('active');
            if (onConfirm) onConfirm();
        };

        modal.classList.add('active');

        // Export close function globally for the secondary button
        window.closeCustomModal = () => modal.classList.remove('active');
    }

    async showPrompt(title, confirmText = 'Растау') {
        return new Promise((resolve) => {
            const modal = document.getElementById('customModal');
            const mTitle = document.getElementById('modalTitle');
            const mText = document.getElementById('modalText');
            const mConfirmBtn = document.getElementById('modalConfirmBtn');
            const mInputCont = document.getElementById('modalInputContainer');
            const mInput = document.getElementById('modalInput');

            if (!modal) return resolve(null);

            mTitle.textContent = title;
            mText.textContent = '';
            if (mInputCont) mInputCont.style.display = 'block';
            if (mInput) mInput.value = '';

            mConfirmBtn.textContent = confirmText;
            mConfirmBtn.onclick = () => {
                modal.classList.remove('active');
                resolve(mInput?.value || '');
            };

            modal.classList.add('active');
            window.closeCustomModal = () => {
                modal.classList.remove('active');
                resolve(null);
            };
        });
    }

    createProblemHTML(p) {
        return `
            <div class="problem-item" data-difficulty="${p.difficulty}">
                <div class="problem-info">
                    <div class="problem-status" id="status-${p.id}"></div>
                    <div>
                        <div class="problem-name">${p.title_kz || p.title}</div>
                        <div class="problem-topic">${p.topic || 'Алгоритм'}</div>
                    </div>
                </div>
                <div class="problem-meta">
                    <span class="difficulty ${p.difficulty}">${p.difficulty}</span>
                </div>
            </div>
        `;
    }
}

// Initialize Global Manager
window.uiManager = new UIManager();