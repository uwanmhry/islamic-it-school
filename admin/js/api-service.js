const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
    constructor() {
        this.authToken = localStorage.getItem('authToken');
        this.currentUser = null;
    }

    setAuthToken(token) {
        this.authToken = token;
        localStorage.setItem('authToken', token);
    }

    removeAuthToken() {
        this.authToken = null;
        localStorage.removeItem('authToken');
        this.currentUser = null;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': this.authToken ? `Bearer ${this.authToken}` : '',
                ...options.headers
            },
            credentials: 'include'
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(url, {
                ...defaultOptions,
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.redirected && response.url.includes('login')) {
                throw new Error('Authentication required');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                const text = await response.text();
                throw new Error(`Non-JSON response: ${text.substring(0, 100)}`);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    // Auth methods
    async login(email, password) {
        const data = await this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        this.setAuthToken(data.access_token);
        this.currentUser = data.user;
        return data;
    }

    async verifyToken() {
        try {
            await this.request('/test');
            this.currentUser = await this.request('/user');
            return this.currentUser;
        } catch (error) {
            this.removeAuthToken();
            throw error;
        }
    }

    // Admin methods
    async createAdmin(adminData) {
        return this.request('/admin/create', {
            method: 'POST',
            body: JSON.stringify(adminData)
        });
    }

    async getAdminList() {
        return this.request('/admin/list');
    }

    async deleteAdmin(adminId) {
        return this.request(`/admin/${adminId}`, {
            method: 'DELETE'
        });
    }

    // Referral methods
    async createReferral(referralData) {
        return this.request('/admin/referrals', {
            method: 'POST',
            body: JSON.stringify(referralData)
        });
    }

    async getReferralData() {
        return this.request('/admin/list'); // Adjust endpoint as needed
    }

    async toggleReferralStatus(referralId, isActive) {
        return this.request(`/admin/referrals/${referralId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ is_active: isActive })
        });
    }

    async deleteReferral(referralId) {
        return this.request(`/admin/referrals/${referralId}`, {
            method: 'DELETE'
        });
    }

    // Purchase methods
    async getPurchaseLogs() {
        return this.request('/admin/purchase-logs');
    }

    async updatePaymentStatus(orderId, status) {
        return this.request(`/referral/purchase-logs/${orderId}`, {
            method: 'PATCH',
            body: JSON.stringify({ payment_status: status })
        });
    }

    // User referral methods
    async getUserReferral() {
        return this.request('/referral');
    }

    async getUserReferralLogs() {
        return this.request('/referral/logs');
    }
}

export const apiService = new ApiService();