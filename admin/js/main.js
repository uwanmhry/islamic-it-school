import { apiService } from './api-service.js';
import { showNotification } from './ui-utils.js';
import { setupLoginPage, logout } from './auth.js';
import { setupAdminModals, loadAdminList, deleteAdmin } from './admin-management.js';
// Import other modules as needed

// Global state
window.adminManagement = { deleteAdmin };
// Add other global functions as needed

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken && !document.getElementById('loginForm')) {
        window.location.href = 'login.html';
        return;
    }
    
    if (authToken) {
        apiService.setAuthToken(authToken);
        initializeApp();
    } else {
        setupLoginPage();
    }
});

async function initializeApp() {
    try {
        await apiService.verifyToken();
        
        // Setup based on page
        if (document.querySelector('title').textContent.includes('Super Admin')) {
            setupSuperAdminPage();
        } else if (document.querySelector('title').textContent.includes('Admin')) {
            setupAdminPage();
        }
    } catch (error) {
        console.error('Initialization error:', error);
        logout();
    }
}

function setupSuperAdminPage() {
    setupNavigation();
    setupAdminModals();
    setupReferralModals();
    setupLogout();
    loadSuperAdminData();
}

function setupAdminPage() {
    setupNavigation();
    setupLogout();
    loadAdminData();
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active-nav-link'));
            link.classList.add('active-nav-link');
            
            // Show target section
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
            });
            document.getElementById(targetSection).classList.remove('hidden');
            
            // Load section data
            loadSectionData(targetSection);
        });
    });
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

async function loadSectionData(section) {
    try {
        switch(section) {
            case 'referral-management':
                await loadReferralData();
                break;
            case 'my-referral':
                await loadMyReferralData();
                break;
            case 'purchase-logs':
                await loadMyPurchaseLogs();
                break;
        }
    } catch (error) {
        console.error(`Error loading ${section} data:`, error);
        showNotification('Gagal memuat data', 'error');
    }
}

async function loadSuperAdminData() {
    try {
        await Promise.all([
            loadDashboardData(),
            loadAdminList(),
            loadReferralData(),
            loadPurchaseLogs()
        ]);
    } catch (error) {
        console.error('Error loading super admin data:', error);
        showNotification('Gagal memuat data', 'error');
    }
}

async function loadAdminData() {
    try {
        await Promise.all([
            loadMyDashboardData(),
            loadMyReferralCode()
        ]);
    } catch (error) {
        console.error('Error loading admin data:', error);
        showNotification('Gagal memuat data', 'error');
    }
}

// Implement other functions similarly, using the apiService