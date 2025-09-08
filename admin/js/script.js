// Admin Panel - Optimized Version

class AdminPanel {
    constructor() {
        this.API_BASE_URL = 'https://iis.portalsi.com/api';
        this.currentUser = null;
        this.authToken = this.getStoredToken();
        this.cache = new Map();
        this.requestController = new AbortController();
        this.debounceTimers = new Map();
        
        this.init();
    }

    // ==================== INITIALIZATION ====================
    
    init() {
        document.addEventListener('DOMContentLoaded', () => this.handleDOMReady());
    }

    async handleDOMReady() {
        try {
            if (!this.authToken && !document.getElementById('loginForm')) {
                this.redirectTo('login.html');
                return;
            }

            await this.initializeApp();
        } catch (error) {
            this.handleError(error, 'Gagal menginisialisasi aplikasi');
        }
    }

    async initializeApp() {
        if (this.authToken) {
            const isValid = await this.verifyToken();
            if (!isValid) return;
        } else if (!document.getElementById('loginForm')) {
            this.redirectTo('index.html');
            return;
        }

        this.setupPageHandlers();
    }

    // ==================== UTILITY METHODS ====================

    getStoredToken() {
        return localStorage.getItem('authToken');
    }

    setStoredToken(token) {
        if (token) {
            localStorage.setItem('authToken', token);
            this.authToken = token;
        } else {
            localStorage.removeItem('authToken');
            this.authToken = null;
        }
    }

    redirectTo(url) {
        window.location.href = url;
    }

    getCurrentPageType() {
        const title = document.querySelector('title')?.textContent || '';
        if (document.getElementById('loginForm')) return 'login';
        if (title.includes('Super Admin')) return 'super-admin';
        if (title.includes('Admin')) return 'admin';
        return 'unknown';
    }

    debounce(key, func, delay = 300) {
        if (this.debounceTimers.has(key)) {
            clearTimeout(this.debounceTimers.get(key));
        }
        
        const timer = setTimeout(() => {
            func();
            this.debounceTimers.delete(key);
        }, delay);
        
        this.debounceTimers.set(key, timer);
    }

    // ==================== API METHODS ====================

    async apiRequest(endpoint, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...options.headers
            },
            credentials: 'include',
            signal: this.requestController.signal,
            ...options
        };

        if (this.authToken && !options.skipAuth) {
            config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}${endpoint}`, config);
            
            if (response.redirected && response.url.includes('login')) {
                throw new Error('Authentication required');
            }

            const contentType = response.headers.get('content-type');
            
            if (contentType?.includes('application/json')) {
                const data = await response.json();
                
                if (!response.ok) {
                    throw new APIError(data.message || 'Request failed', response.status, data);
                }
                
                return data;
            } else if (!response.ok) {
                const text = await response.text();
                if (text.includes('login') || text.includes('Login')) {
                    throw new Error('Session expired');
                }
                throw new Error(`Server error: ${response.status}`);
            }
            
            return response;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    async verifyToken() {
        try {
            const userData = await this.apiRequest('/user');
            this.currentUser = userData;
            
            const pageType = this.getCurrentPageType();
            const userRole = userData.role;
            
            // Redirect based on role and current page
            if (userRole === 'super_admin' && pageType !== 'super-admin') {
                this.redirectTo('super-admin.html');
                return false;
            } else if (userRole === 'admin' && pageType !== 'admin') {
                this.redirectTo('admin.html');
                return false;
            }
            
            return true;
        } catch (error) {
            this.handleAuthError(error);
            return false;
        }
    }

    // ==================== ERROR HANDLING ====================

    handleError(error, defaultMessage = 'Terjadi kesalahan') {
        console.error('Error:', error);
        
        if (this.isAuthError(error)) {
            this.handleAuthError(error);
        } else {
            this.showNotification(error.message || defaultMessage, 'error');
        }
    }

    isAuthError(error) {
        return error.message.includes('token') || 
               error.message.includes('authentication') ||
               error.message.includes('Authentication required') ||
               error.message.includes('Session expired');
    }

    handleAuthError(error) {
        this.showNotification('Sesi telah berakhir, silakan login kembali', 'error');
        this.logout();
    }

    // ==================== PAGE SETUP ====================

    setupPageHandlers() {
        const pageType = this.getCurrentPageType();
        
        switch (pageType) {
            case 'login':
                this.setupLoginPage();
                break;
            case 'super-admin':
                this.setupSuperAdminPage();
                this.loadSuperAdminData();
                break;
            case 'admin':
                this.setupAdminPage();
                this.loadAdminData();
                break;
        }
    }

    setupLoginPage() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    setupSuperAdminPage() {
        this.setupSidebarToggle();
        this.setupNavigation();
        this.setupLogoutButton();
        this.setupModals();
    }

    setupAdminPage() {
        this.setupSidebarToggle();
        this.setupNavigation();
        this.setupLogoutButton();
        this.setupCopyReferralButton();
    }

    setupSidebarToggle() {
        const toggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('-translate-x-full');
            });
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('nav a[data-section]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link, navLinks);
            });
        });
    }

    handleNavigation(activeLink, allLinks) {
        const targetSection = activeLink.getAttribute('data-section');
        
        // Update active nav link
        allLinks.forEach(link => link.classList.remove('active-nav-link'));
        activeLink.classList.add('active-nav-link');
        
        // Show target section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        const targetElement = document.getElementById(targetSection);
        if (targetElement) {
            targetElement.classList.remove('hidden');
        }
        
        // Load section-specific data
        this.loadSectionData(targetSection);
    }

    loadSectionData(section) {
        this.debounce(`load-${section}`, () => {
            switch (section) {
                case 'referral-management':
                    this.loadReferralData();
                    break;
                case 'my-referral':
                    this.loadMyReferralData();
                    break;
                case 'purchase-logs':
                    this.loadMyPurchaseLogs();
                    break;
            }
        });
    }

    setupLogoutButton() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    setupCopyReferralButton() {
        const copyBtn = document.getElementById('copyReferralBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyReferralCode());
        }
    }

    // ==================== MODAL SETUP ====================

    setupModals() {
        this.setupCreateAdminModal();
        this.setupCreateReferralModal();
    }

    setupCreateAdminModal() {
        const elements = this.getModalElements('createAdmin');
        if (!elements.btn || !elements.modal) return;

        elements.btn.addEventListener('click', async () => {
            const isValid = await this.testEndpoint('/admin/create');
            if (!isValid) {
                this.showNotification('Tidak dapat mengakses endpoint. Silakan refresh halaman.', 'error');
                return;
            }
            elements.modal.classList.remove('hidden');
        });

        if (elements.cancel) {
            elements.cancel.addEventListener('click', () => {
                elements.modal.classList.add('hidden');
            });
        }

        if (elements.form) {
            elements.form.addEventListener('submit', (e) => this.handleCreateAdmin(e));
        }

        this.setupModalClickOutside(elements.modal);
    }

    setupCreateReferralModal() {
        const elements = this.getModalElements('createReferral');
        if (!elements.btn || !elements.modal) return;

        elements.btn.addEventListener('click', async () => {
            await this.loadAdminsForDropdown();
            elements.modal.classList.remove('hidden');
        });

        if (elements.cancel) {
            elements.cancel.addEventListener('click', () => {
                elements.modal.classList.add('hidden');
            });
        }

        if (elements.form) {
            elements.form.addEventListener('submit', (e) => this.handleCreateReferral(e));
        }

        this.setupModalClickOutside(elements.modal);
    }

    getModalElements(prefix) {
        return {
            btn: document.getElementById(`${prefix}Btn`),
            modal: document.getElementById(`${prefix}Modal`),
            cancel: document.getElementById(`cancel${prefix.charAt(0).toUpperCase() + prefix.slice(1)}`),
            form: document.getElementById(`${prefix}Form`)
        };
    }

    setupModalClickOutside(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // ==================== AUTHENTICATION ====================

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        const ui = this.getLoginUIElements();
        this.setLoginLoadingState(ui, true);

        try {
            const data = await this.apiRequest('/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
                skipAuth: true
            });

            this.setStoredToken(data.access_token);
            this.currentUser = data.user;

            const redirectUrl = data.user.role === 'super_admin' ? 'super-admin.html' : 'admin.html';
            this.redirectTo(redirectUrl);

        } catch (error) {
            this.displayLoginError(ui, error.message || 'Login gagal');
        } finally {
            this.setLoginLoadingState(ui, false);
        }
    }

    getLoginUIElements() {
        return {
            text: document.getElementById('loginText'),
            spinner: document.getElementById('loginSpinner'),
            message: document.getElementById('loginMessage')
        };
    }

    setLoginLoadingState(ui, isLoading) {
        if (isLoading) {
            ui.text?.classList.add('hidden');
            ui.spinner?.classList.remove('hidden');
            ui.message?.classList.add('hidden');
        } else {
            ui.text?.classList.remove('hidden');
            ui.spinner?.classList.add('hidden');
        }
    }

    displayLoginError(ui, message) {
        if (ui.message) {
            ui.message.textContent = message;
            ui.message.classList.remove('hidden');
            ui.message.classList.add('text-red-500');
        }
    }

    logout() {
        this.setStoredToken(null);
        this.currentUser = null;
        this.cache.clear();
        this.requestController.abort();
        this.requestController = new AbortController();
        this.redirectTo('index.html');
    }

    // ==================== DATA LOADING ====================

    async loadSuperAdminData() {
        try {
            await Promise.all([
                this.loadDashboardData(),
                this.loadAdminList(),
                this.loadReferralData(),
                this.loadPurchaseLogs()
            ]);
        } catch (error) {
            this.handleError(error, 'Gagal memuat data');
        }
    }

    async loadAdminData() {
        try {
            await Promise.all([
                this.loadMyDashboardData(),
                this.loadMyReferralCode()
            ]);
        } catch (error) {
            this.handleError(error, 'Gagal memuat data');
        }
    }

    async loadDashboardData() {
        try {
            const [adminData, purchaseData] = await Promise.all([
                this.apiRequest('/admin/list'),
                this.apiRequest('/admin/purchase-logs')
            ]);

            this.updateElementText('totalAdmins', adminData.data?.length || 0);
            this.updateElementText('totalPurchases', purchaseData.total || 0);
            
            this.createDashboardChart();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async loadAdminList() {
        const cacheKey = 'adminList';
        
        try {
            const data = await this.getCachedOrFetch(cacheKey, '/admin/list');
            const adminList = document.getElementById('adminList');
            
            if (!adminList) return;

            const adminRows = data.data?.map(admin => this.createAdminRow(admin)).join('') || '';
            adminList.innerHTML = adminRows || this.createEmptyRow('Tidak ada data admin', 5);

        } catch (error) {
            this.handleError(error, 'Gagal memuat daftar admin');
        }
    }

    createAdminRow(admin) {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=random`;
        const referralCode = admin.referral_code?.code || '-';
        const usageCount = admin.referral_code?.usage_count || 0;

        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-full" src="${avatarUrl}" alt="${admin.name}">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${admin.name}</div>
                            <div class="text-sm text-gray-500">${admin.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${admin.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${referralCode}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        ${usageCount}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="text-red-600 hover:text-red-900" onclick="adminPanel.deleteAdmin(${admin.id})">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    }

    async loadReferralData() {
        try {
            const data = await this.apiRequest('/admin/list');
            const referralList = document.getElementById('referralList');
            
            if (!referralList) return;

            if (data.data?.length > 0) {
                const rows = data.data.map(referral => this.createReferralRow(referral)).join('');
                referralList.innerHTML = rows;
                this.setupReferralEventListeners();
            } else {
                referralList.innerHTML = this.createEmptyRow('Tidak ada data referral', 5);
            }

            await this.loadReferralLogs();
        } catch (error) {
            this.handleError(error, 'Gagal memuat data referral');
        }
    }

    createReferralRow(referral) {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(referral.name)}&background=random`;
        const referralCode = referral.referral_code?.code || '-';
        const usageCount = referral.referral_code?.usage_count || 0;
        const statusBadge = '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>';

        const copyButton = referralCode !== '-' ? 
            `<button class="text-xs text-blue-600 hover:text-blue-800 copy-btn" data-code="${referralCode}">
                <i class="fas fa-copy mr-1"></i>Salin
            </button>` : '';

        const actionButtons = referral.referral_code ? 
            `<button class="text-indigo-600 hover:text-indigo-900 mr-2 toggle-status-btn" data-id="${referral.referral_code.id}" data-status="true">
                Nonaktifkan
            </button>
            <button class="text-red-600 hover:text-red-900 delete-referral-btn" data-id="${referral.referral_code.id}">
                Hapus
            </button>` : '-';

        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-full" src="${avatarUrl}" alt="${referral.name}">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${referral.name}</div>
                            <div class="text-sm text-gray-500">${referral.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${referralCode}</div>
                    ${copyButton}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        ${usageCount}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">${actionButtons}</td>
            </tr>
        `;
    }

    setupReferralEventListeners() {
        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.getAttribute('data-code');
                this.copyToClipboard(code, `Kode referral berhasil disalin: ${code}`);
            });
        });

        // Toggle status buttons
        document.querySelectorAll('.toggle-status-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const referralId = btn.getAttribute('data-id');
                const currentStatus = btn.getAttribute('data-status') === 'true';
                this.toggleReferralStatus(referralId, !currentStatus);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-referral-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const referralId = btn.getAttribute('data-id');
                this.deleteReferral(referralId);
            });
        });
    }

    // ==================== ADMIN/REFERRAL ACTIONS ====================

    async testEndpoint(endpoint) {
        try {
            const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
                method: 'OPTIONS',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Accept': 'application/json'
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Endpoint test failed:', error);
            return false;
        }
    }

    async handleCreateAdmin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const adminData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            password_confirmation: formData.get('passwordConfirmation')
        };

        if (adminData.password !== adminData.password_confirmation) {
            this.showNotification('Konfirmasi password tidak sesuai', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.setButtonLoadingState(submitBtn, true, 'Membuat...');

        try {
            await this.apiRequest('/admin/create', {
                method: 'POST',
                body: JSON.stringify(adminData)
            });

            this.showNotification('Admin berhasil dibuat', 'success');
            this.closeModal('createAdminModal');
            e.target.reset();
            this.cache.delete('adminList'); // Invalidate cache
            await this.loadAdminList();

        } catch (error) {
            const errorMsg = error.data?.errors ? 
                Object.values(error.data.errors).flat().join(', ') : 
                error.message || 'Gagal membuat admin';
            this.showNotification(errorMsg, 'error');
        } finally {
            this.setButtonLoadingState(submitBtn, false);
        }
    }

    async handleCreateReferral(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const referralData = {
            user_id: formData.get('userId'),
            code: formData.get('code') || undefined
        };

        if (!referralData.user_id) {
            this.showNotification('Pilih admin terlebih dahulu', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.setButtonLoadingState(submitBtn, true, 'Membuat...');

        try {
            await this.apiRequest('/admin/referrals', {
                method: 'POST',
                body: JSON.stringify(referralData)
            });

            this.showNotification('Kode referral berhasil dibuat', 'success');
            this.closeModal('createReferralModal');
            e.target.reset();
            await this.loadReferralData();

        } catch (error) {
            this.showNotification(error.message || 'Gagal membuat kode referral', 'error');
        } finally {
            this.setButtonLoadingState(submitBtn, false);
        }
    }

    async loadAdminsForDropdown() {
        try {
            const data = await this.apiRequest('/admin/list');
            const dropdown = document.getElementById('referralAdmin');
            
            if (!dropdown) return;

            // Clear existing options except first
            while (dropdown.options.length > 1) {
                dropdown.remove(1);
            }

            const availableAdmins = data.data?.filter(admin => !admin.referral_code) || [];
            
            if (availableAdmins.length > 0) {
                availableAdmins.forEach(admin => {
                    const option = document.createElement('option');
                    option.value = admin.id;
                    option.textContent = `${admin.name} (${admin.email})`;
                    dropdown.appendChild(option);
                });
            } else {
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "Semua admin sudah memiliki kode referral";
                option.disabled = true;
                dropdown.appendChild(option);
            }

        } catch (error) {
            this.handleError(error, 'Gagal memuat daftar admin');
        }
    }

    async toggleReferralStatus(referralId, newStatus) {
        const action = newStatus ? 'mengaktifkan' : 'menonaktifkan';
        
        if (!confirm(`Apakah Anda yakin ingin ${action} referral ini?`)) {
            return;
        }

        try {
            await this.apiRequest(`/admin/referrals/${referralId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ is_active: newStatus })
            });

            this.showNotification(`Status referral berhasil ${action}`, 'success');
            await this.loadReferralData();
        } catch (error) {
            this.handleError(error, 'Gagal mengubah status referral');
        }
    }

    async deleteReferral(referralId) {
        if (!confirm('Apakah Anda yakin ingin menghapus referral ini?')) {
            return;
        }

        try {
            await this.apiRequest(`/admin/referrals/${referralId}`, {
                method: 'DELETE'
            });

            this.showNotification('Referral berhasil dihapus', 'success');
            await this.loadReferralData();
        } catch (error) {
            this.handleError(error, 'Gagal menghapus referral');
        }
    }

    async deleteAdmin(adminId) {
        if (!confirm('Apakah Anda yakin ingin menghapus admin ini?')) {
            return;
        }

        try {
            await this.apiRequest(`/admin/${adminId}`, {
                method: 'DELETE'
            });

            this.showNotification('Admin berhasil dihapus', 'success');
            this.cache.delete('adminList'); // Invalidate cache
            await this.loadAdminList();
        } catch (error) {
            this.handleError(error, 'Gagal menghapus admin');
        }
    }

    // ==================== UTILITY METHODS ====================

    async getCachedOrFetch(key, endpoint, ttl = 300000) { // 5 minutes TTL
        const cached = this.cache.get(key);
        const now = Date.now();
        
        if (cached && (now - cached.timestamp < ttl)) {
            return cached.data;
        }
        
        const data = await this.apiRequest(endpoint);
        this.cache.set(key, { data, timestamp: now });
        return data;
    }

    updateElementText(id, text) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    createEmptyRow(message, colspan) {
        return `
            <tr>
                <td colspan="${colspan}" class="px-6 py-4 text-center text-sm text-gray-500">
                    ${message}
                </td>
            </tr>
        `;
    }

    setButtonLoadingState(button, isLoading, loadingText = 'Loading...') {
        if (!button) return;
        
        if (isLoading) {
            button.dataset.originalText = button.textContent;
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
            button.disabled = true;
        } else {
            button.textContent = button.dataset.originalText || 'Submit';
            button.disabled = false;
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    async copyToClipboard(text, successMessage = 'Berhasil disalin') {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification(successMessage, 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('Gagal menyalin', 'error');
        }
    }

    copyReferralCode() {
        const codeElement = document.getElementById('referralCodeDisplay');
        if (codeElement) {
            this.copyToClipboard(codeElement.textContent, 'Kode referral berhasil disalin');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        }[type] || 'bg-blue-500';

        notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white ${bgColor}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // ==================== DATA LOADING - ADDITIONAL METHODS ====================

    async loadReferralLogs() {
        try {
            const data = await this.apiRequest('/admin/purchase-logs');
            const referralLogs = document.getElementById('referralLogs');
            
            if (!referralLogs) return;

            if (data.data?.length > 0) {
                const rows = data.data.map(log => this.createReferralLogRow(log)).join('');
                referralLogs.innerHTML = rows;
            } else {
                referralLogs.innerHTML = this.createEmptyRow('Tidak ada data log referral', 4);
            }
        } catch (error) {
            console.error('Error loading referral logs:', error);
        }
    }

    createReferralLogRow(log) {
        const date = new Date(log.created_at);
        const formattedDate = date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const statusClass = log.payment_status === 'success' ? 
            'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.referral_code.code}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.buyer_name || 'Tidak diketahui'}</div>
                    <div class="text-sm text-gray-500">${log.user_email || ''}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formattedDate}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${log.payment_status || 'unknown'}
                    </span>
                </td>
            </tr>
        `;
    }

    async loadPurchaseLogs() {
        try {
            const data = await this.apiRequest('/admin/purchase-logs');
            const purchaseLogs = document.getElementById('purchaseLogs');
            
            if (!purchaseLogs) return;

            if (data.data?.length > 0) {
                const rows = data.data.map(log => this.createPurchaseLogRow(log)).join('');
                purchaseLogs.innerHTML = rows;
            } else {
                purchaseLogs.innerHTML = this.createEmptyRow('Tidak ada data pembelian', 9);
            }
        } catch (error) {
            console.error('Error loading purchase logs:', error);
        }
    }

    createPurchaseLogRow(log) {
        const statusClasses = {
            success: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800'
        };
        const statusClass = statusClasses[log.payment_status] || 'bg-gray-100 text-gray-800';

        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.order_id}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.book_title}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.buyer_name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.email || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.phone || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">Rp ${log.final_price.toLocaleString('id-ID')}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${log.payment_status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.referral_code.code || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900" onclick="adminPanel.updatePaymentStatus('${log.order_id}', 'success')">Success</button>
                    <button class="text-yellow-600 hover:text-yellow-900 ml-2" onclick="adminPanel.updatePaymentStatus('${log.order_id}', 'pending')">Pending</button>
                    <button class="text-red-600 hover:text-red-900 ml-2" onclick="adminPanel.updatePaymentStatus('${log.order_id}', 'failed')">Failed</button>
                </td>
            </tr>
        `;
    }

    async updatePaymentStatus(orderId, status) {
        try {
            await this.apiRequest(`/referral/purchase-logs/${orderId}`, {
                method: 'PATCH',
                body: JSON.stringify({ payment_status: status })
            });

            this.showNotification('Status pembayaran berhasil diperbarui', 'success');
            await this.loadPurchaseLogs();
        } catch (error) {
            this.handleError(error, 'Gagal memperbarui status pembayaran');
        }
    }

    // ==================== ADMIN SPECIFIC DATA LOADING ====================

    async loadMyDashboardData() {
        try {
            const [referralData, purchaseData] = await Promise.all([
                this.apiRequest('/referral'),
                this.apiRequest('/referral/logs')
            ]);

            this.updateElementText('myReferralCode', referralData.referral_code);
            this.updateElementText('myReferralUsage', referralData.usage_count);
            this.updateElementText('myTotalPurchases', purchaseData.total || 0);
            
            this.displayRecentPurchases(purchaseData.data);
            this.createMyUsageChart();
        } catch (error) {
            console.error('Error loading admin dashboard data:', error);
        }
    }

    displayRecentPurchases(purchases) {
        const container = document.getElementById('myRecentPurchases');
        if (!container) return;

        container.innerHTML = '';

        if (purchases?.length > 0) {
            purchases.slice(0, 3).forEach(purchase => {
                const purchaseElement = document.createElement('div');
                purchaseElement.classList.add('flex', 'items-center', 'justify-between', 'border-b', 'pb-3');
                
                const statusClass = purchase.payment_status === 'success' ? 
                    'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

                purchaseElement.innerHTML = `
                    <div class="flex items-center">
                        <div class="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div>
                            <p class="font-semibold">${purchase.book_title}</p>
                            <p class="text-sm text-gray-500">${purchase.buyer_name} • Rp ${purchase.final_price.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    <span class="px-2 text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${purchase.payment_status}
                    </span>
                `;
                container.appendChild(purchaseElement);
            });
        } else {
            container.innerHTML = '<p class="text-gray-500 text-center">Tidak ada data pembelian</p>';
        }
    }

    async loadMyReferralCode() {
        try {
            const data = await this.apiRequest('/referral');
            
            this.updateElementText('referralCodeDisplay', data.referral_code);
            this.updateElementText('referralUsageCount', data.usage_count);
            this.updateElementText('successfulPurchases', data.usage_count);
        } catch (error) {
            console.error('Error loading referral code:', error);
        }
    }

    async loadMyReferralData() {
        try {
            const data = await this.apiRequest('/referral/logs');
            const referralLogs = document.getElementById('myReferralLogs');
            
            if (!referralLogs) return;

            if (data.data?.length > 0) {
                const rows = data.data.map(log => this.createMyReferralLogRow(log)).join('');
                referralLogs.innerHTML = rows;
            } else {
                referralLogs.innerHTML = this.createEmptyRow('Tidak ada data penggunaan referral', 5);
            }
        } catch (error) {
            console.error('Error loading referral data:', error);
        }
    }

    createMyReferralLogRow(log) {
        const statusClass = log.payment_status === 'success' ? 
            'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${new Date().toLocaleDateString('id-ID')}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.buyer_name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.book_title}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">Rp ${log.final_price.toLocaleString('id-ID')}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${log.payment_status}
                    </span>
                </td>
            </tr>
        `;
    }

    async loadMyPurchaseLogs() {
        try {
            const data = await this.apiRequest('/referral/logs');
            const purchaseLogs = document.getElementById('myPurchaseLogs');
            
            if (!purchaseLogs) return;

            if (data.data?.length > 0) {
                const rows = data.data.map(log => this.createMyPurchaseLogRow(log)).join('');
                purchaseLogs.innerHTML = rows;
            } else {
                purchaseLogs.innerHTML = this.createEmptyRow('Tidak ada data pembelian', 6);
            }
        } catch (error) {
            console.error('Error loading purchase logs:', error);
        }
    }

    createMyPurchaseLogRow(log) {
        const statusClasses = {
            success: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800'
        };
        const statusClass = statusClasses[log.payment_status] || 'bg-gray-100 text-gray-800';

        const formattedDate = new Date(log.created_at).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.order_id}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.book_title}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${log.buyer_name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">Rp ${log.final_price.toLocaleString('id-ID')}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${log.payment_status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formattedDate}</div>
                </td>
            </tr>
        `;
    }

    // ==================== CHART CREATION ====================

    createDashboardChart() {
        const ctx = document.getElementById('usageChart');
        if (ctx && typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
                    datasets: [{
                        label: 'Penggunaan Referral',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    createMyUsageChart() {
        const ctx = document.getElementById('myUsageChart');
        if (ctx && typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Berhasil', 'Pending', 'Gagal'],
                    datasets: [{
                        data: [15, 3, 2],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 205, 86, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }
    }

    // ==================== PASSWORD UTILITY ====================

    togglePassword(inputId = 'password', iconId = 'eyeIcon') {
        const passwordInput = document.getElementById(inputId);
        const eyeIcon = document.getElementById(iconId);
        
        if (!passwordInput || !eyeIcon) return;
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    }
}

// ==================== CUSTOM ERROR CLASS ====================

class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// ==================== INITIALIZE APPLICATION ====================

// Create global instance
const adminPanel = new AdminPanel();

// Expose methods that need to be called from HTML onclick attributes
window.adminPanel = adminPanel;

// Additional global functions for backward compatibility
function togglePassword(inputId, iconId) {
    adminPanel.togglePassword(inputId, iconId);
}