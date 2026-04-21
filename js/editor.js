// /js/editor.js - Код редакторы және компилятор

class CodeEditor {
    constructor() {
        this.currentLanguage = 'python';
        this.problemId = null;
        this.editor = null;
        
        // Judge0 API конфигурациясы (өз серверіңізді қолданыңыз)
        this.judge0Url = 'https://judge0-ce.p.rapidapi.com'; // Немесе өз серверіңіз
        this.judge0Key = 'СЕНІҢ_RAPIDAPI_KEY'; // RapidAPI кілті
        
        this.languageIds = {
            'python': 71,      // Python 3.8
            'cpp': 54,         // C++ GCC 9.2
            'csharp': 51       // C# Mono 6.6
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCodeTemplates();
    }

    setupEventListeners() {
        // Тіл таңдау
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.setLanguage(lang);
            });
        });

        // Run батырмасы
        const runBtn = document.querySelector('.run-btn');
        if (runBtn) {
            runBtn.addEventListener('click', () => this.runCode());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.runCode();
            }
        });
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        
        // UI жаңарту
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Код мүмкіндігін сақтау
        const currentCode = this.getCode();
        if (currentCode && this.problemId) {
            this.saveDraft(this.problemId, this.currentLanguage, currentCode);
        }

        // Жаңа тілдің бастапқы кодын жүктеу
        this.loadInitialCode();
    }

    loadInitialCode() {
        if (!this.problemId) return;

        // Алдымен сақталған draft-ты тексеру
        const draft = this.getDraft(this.problemId, this.currentLanguage);
        if (draft) {
            this.setCode(draft);
            return;
        }

        // Базадан бастапқы кодты алу
        db.getProblemById(this.problemId).then(problem => {
            const code = problem[`initial_code_${this.currentLanguage}`] || 
                        this.getDefaultTemplate(this.currentLanguage);
            this.setCode(code);
        });
    }

    getDefaultTemplate(lang) {
        const templates = {
            python: `# Python кодын осы жерге жазыңыз
print("Сәлем, CodeMaster!")`,
            cpp: `#include <iostream>
using namespace std;

int main() {
    // C++ кодын осы жерге жазыңыз
    cout << "Сәлем, CodeMaster!" << endl;
    return 0;
}`,
            csharp: `using System;

class Program {
    static void Main() {
        // C# кодын осы жерге жазыңыз
        Console.WriteLine("Сәлем, CodeMaster!");
    }
}`
        };
        return templates[lang];
    }

    async runCode() {
        const code = this.getCode();
        const outputEl = document.getElementById('outputDisplay');
        const runBtn = document.querySelector('.run-btn');

        if (!code.trim()) {
            this.showOutput('⚠️ Код жазылмаған!', 'warning');
            return;
        }
            // UI жүктелу күйі
        runBtn.disabled = true;
        runBtn.innerHTML = '<div class="loading-spinner"></div> Орындалуда...';
        this.showOutput('⏳ Код орындалуда...', 'info');

        try {
            // Егер problemId бар болса, тест кейстерін алу
            let testCases = [];
            if (this.problemId) {
                const problem = await db.getProblemById(this.problemId);
                testCases = problem.test_cases || [];
            }

            // Judge0 API-ға сұраныс
            const result = await this.executeWithJudge0(code, testCases);
            
            // Нәтижені көрсету
            this.displayResult(result);

            // Егер барлық тесттерден өтсе, прогресс сақтау
            if (result.success && this.problemId) {
                await this.handleSuccessSubmit(code, result);
            }

        } catch (error) {
            this.showOutput(`❌ Қате: ${error.message}`, 'error');
            console.error('Execution error:', error);
        } finally {
            runBtn.disabled = false;
            runBtn.innerHTML = '<i class="bx bx-play"></i> Іске қосу (Ctrl+Enter)';
        }
    }

    async executeWithJudge0(code, testCases) {
        const languageId = this.languageIds[this.currentLanguage];
        
        // Негізгі сұраныс
        const submission = {
            source_code: code,
            language_id: languageId,
            stdin: '',
            expected_output: '',
            cpu_time_limit: 1,
            memory_limit: 64000
        };

        // Егер тест кейстері бар болса, біріншісін қолдану
        if (testCases.length > 0) {
            submission.stdin = testCases[0].input;
            submission.expected_output = testCases[0].output;
        }

        // Judge0-ға жіберу
        const response = await fetch(`${this.judge0Url}/submissions?base64_encoded=false&wait=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': this.judge0Key,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify(submission)
        });

        if (!response.ok) {
            throw new Error('Компилятор серверіне қосылу мүмкін болмады');
        }

        const result = await response.json();

        // Нәтижені талдау
        return this.parseJudgeResult(result, testCases);
    }

    parseJudgeResult(result, testCases) {
        const status = result.status;
        const output = {
            success: false,
            stdout: result.stdout || '',
            stderr: result.stderr || '',
            compileOutput: result.compile_output || '',
            time: result.time,
            memory: result.memory,
            message: '',
            testResults: []
        };

        // Статус кодтарын тексеру
        switch (status.id) {
            case 3: // Accepted
                output.success = true;
                output.message = '✅ Дұрыс! Барлық тесттерден өтті.';
                break;
            case 4: // Wrong Answer
                output.message = '❌ Қате жауап. Кіріс/шығыс деректерін тексер.';
                break;
            case 5: // Time Limit Exceeded
                output.message = '⏱️ Уақыт шегі асып кетті. Кодты оңтайландыр.';
                break;
            case 6: // Compilation Error
                output.message = '🔧 Компиляция қатесі!';
                output.stderr = result.compile_output;
                break;
            case 7: // Runtime Error (SIGSEGV)
                output.message = '💥 Жүктеу қатесі (Memory/Array)';
                break;
            case 8: // Runtime Error (SIGXFSZ)
                output.message = '📁 Файл өлшемі шегі асып кетті';
                break;
            case 9: // Runtime Error (SIGFPE)
                output.message = '🔢 Арифметикалық қате (0-ге бөлу)';
                break;
            case 10: // Runtime Error (SIGABRT)
                output.message = '🛑 Бағдарлама тоқтатылды';
                break;
            case 11: // Runtime Error (NZEC)
                output.message = '❌ Нөлдік кодпен шығу (return 0 қос)';
                break;
            case 12: // Runtime Error (Other)
                output.message = '⚠️ Беймәлім жүктеу қатесі';
                break;
            case 13: // Internal Error
                output.message = '🔧 Сервер ішкі қатесі';
                break;
            case 14: // Exec Format Error
                output.message = '❌ Орындау форматы қатесі';
                break;
            default:
                output.message = `⚠️ Беймәлім статус: ${status.description}`;
        }

        // Қосымша тесттерді тексеру (егер бар болса)
        if (testCases.length > 1 && output.success) {
            output.testResults = this.runAdditionalTests(testCases.slice(1));
        }

        return output;
    }

    async runAdditionalTests(testCases) {
        // Қосымша тесттерді асинхрон орындау
        const results = [];
        
        for (const test of testCases) {
            const submission = {
                source_code: this.getCode(),
                language_id: this.languageIds[this.currentLanguage],
                stdin: test.input,
                expected_output: test.output,
                cpu_time_limit: 1,
                memory_limit: 64000
            };

            try {
                const response = await fetch(`${this.judge0Url}/submissions?base64_encoded=false&wait=true`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': this.judge0Key
                    },
                    body: JSON.stringify(submission)
                });

                const result = await response.json();
                results.push({
                    input: test.input,
                    expected: test.output,
                    actual: result.stdout?.trim(),
                    passed: result.status.id === 3
                });
            } catch (err) {
                results.push({
                    input: test.input,
                    error: err.message,
                    passed: false
                });
            }
        }

        return results;
    }

    displayResult(result) {
        let html = `<div class="result-header ${result.success ? 'success' : 'error'}">`;
        html += `<strong>${result.message}</strong>`;
        
        if (result.time) {
            html += `<span class="execution-stats">⏱️ ${result.time}s | 🧠 ${Math.round(result.memory / 1024)}KB</span>`;
        }
        html += `</div>`;

        if (result.stdout) {
            html += `<div class="output-section">
                <h4>📤 Шығыс:</h4>
                <pre class="code-output">${this.escapeHtml(result.stdout)}</pre>
            </div>`;
        }

        if (result.stderr) {
            html += `<div class="output-section error">
                <h4>⚠️ Қате:</h4>
                <pre class="code-output error">${this.escapeHtml(result.stderr)}</pre>
            </div>`;
        }

        if (result.compileOutput) {
            html += `<div class="output-section compile-error">
                <h4>🔧 Компилятор хабарламасы:</h4>
                <pre class="code-output">${this.escapeHtml(result.compileOutput)}</pre>
            </div>`;
        }

        // Тест нәтижелері
        if (result.testResults && result.testResults.length > 0) {
            html += `<div class="test-results">`;
            html += `<h4>🧪 Қосымша тесттер (${result.testResults.filter(t => t.passed).length}/${result.testResults.length}):</h4>`;
            
            result.testResults.forEach((test, idx) => {
                const status = test.passed ? '✅' : '❌';
                const className = test.passed ? 'test-pass' : 'test-fail';
                html += `<div class="test-case ${className}">
                    <span>${status} Тест #${idx + 2}</span>
                    ${!test.passed ? `<div class="test-details">
                        Кіріс: ${this.escapeHtml(test.input)}<br>
                        Күтілген: ${this.escapeHtml(test.expected)}<br>
                        Алынған: ${this.escapeHtml(test.actual)}
                    </div>` : ''}
                </div>`;
            });
            html += `</div>`;
        }

        this.showOutput(html, result.success ? 'success' : 'error', true);
    }

    async handleSuccessSubmit(code, result) {
        const userId = authManager.getCurrentUser()?.id;
        if (!userId) return;

        try {
            // Прогресс сақтау
            await db.submitSolution(
                userId,
                this.problemId,
                code,
                this.currentLanguage,
                'solved'
            );

            // Күнделікті мақсатты жаңарту
            const goalUpdate = await db.incrementDailyProgress(userId);
            
            // Конфетти эффекті
            if (typeof createConfetti === 'function') {
                createConfetti();
            }

            // Toast хабарлама
            showToast('🎉 Есеп шешілді! +XP алынды', 'success');

            if (goalUpdate.justCompleted) {
                setTimeout(() => {
                    showToast('🎯 Күнделікті мақсат орындалды!', 'success');
                }, 1500);
            }

            // Келесі есепке өту мүмкіндігі
            setTimeout(() => {
                this.askNextProblem();
            }, 2000);

        } catch (error) {
            console.error('Progress save error:', error);
            showToast('Прогресс сақталмады, бірақ есеп дұрыс!', 'warning');
        }
    }

    askNextProblem() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal success-modal">
                <div class="modal-icon">🎉</div>
                <h2>Есеп шешілді!</h2>
                <p>Келесі не істейміз?</p>
                <div class="modal-actions">
                    <button class="modal-btn secondary" onclick="this.closest('.modal-overlay').remove()">
                        Мұнда қалу
                    </button>
                    <button class="modal-btn primary" onclick="loadNextProblem(); this.closest('.modal-overlay').remove()">
                        Келесі есеп →
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // ============ Utility Methods ============

    getCode() {
        const editor = document.getElementById('codeEditor');
        return editor ? editor.value : '';
    }

    setCode(code) {
        const editor = document.getElementById('codeEditor');
        if (editor) editor.value = code;
    }

    showOutput(content, type = 'info', isHtml = false) {
        const outputEl = document.getElementById('outputDisplay');
        if (!outputEl) return;

        outputEl.className = `output-display ${type}`;
        
        if (isHtml) {
            outputEl.innerHTML = content;
        } else {
            outputEl.textContent = content;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveDraft(problemId, language, code) {
        const key = `draft_${problemId}_${language}`;
        localStorage.setItem(key, code);
        localStorage.setItem(`${key}_time`, Date.now());
    }

    getDraft(problemId, language) {
        const key = `draft_${problemId}_${language}`;
        const draft = localStorage.getItem(key);
        const time = localStorage.getItem(`${key}_time`);
        
        // 7 күннен ескі draft-тарды өшіру
        if (time && Date.now() - parseInt(time) > 7 * 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
            localStorage.removeItem(`${key}_time`);
            return null;
        }
        
        return draft;
    }

    clearDrafts() {
        Object.keys(localStorage)
            .filter(key => key.startsWith('draft_'))
            .forEach(key => localStorage.removeItem(key));
    }

    setProblem(problemId) {
        this.problemId = problemId;
        this.loadInitialCode();
    }

    // ============ Admin: Test Case Generator ============

    generateTestCases(solutionCode, count = 5) {
        // Бұл функция админ панелінде қолданылады
        // Автоматты тест кейс генерациясы (келешекте AIмен)
        console.log('Generating test cases for:', solutionCode);
        return Array.from({ length: count }, (_, i) => ({
            input: `test_input_${i + 1}`,
            output: `expected_output_${i + 1}`
        }));
    }
}

// Глобалды инстанс
const codeEditor = new CodeEditor();

// Келесі есепті жүктеу (глобалды функция)
async function loadNextProblem() {
    const current = codeEditor.problemId;
    const { data: problems } = await _supabase
        .from('problems')
        .select('id')
        .gt('id', current)
        .eq('is_active', true)
        .order('id')
        .limit(1);

    if (problems && problems.length > 0) {
        codeEditor.setProblem(problems[0].id);
        showToast('Келесі есеп жүктелді!', 'success');
    } else {
        showToast('Бұл тақырыптағы барлық есептер шешілді! 🎉', 'success');
    }
}