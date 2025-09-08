import { apiService } from './api-service.js';
import { showNotification } from './ui-utils.js';

export async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');
    const loginMessage = document.getElementById('loginMessage');
    
    loginText.classList.add('hidden');
    loginSpinner.classList.remove('hidden');
    loginMessage.classList.add('hidden');
    
    try {
        const data = await apiService.login(email, password);
        
        if (data.user.role === 'super_admin') {
            window.location.href = 'super-admin.html';
        } else {
            window.location.href = 'admin.html';
        }
    } catch (error) {
        console.error('Login error:', error);
        loginMessage.textContent = error.message || 'Login gagal';
        loginMessage.classList.remove('hidden');
        loginMessage.classList.add('text-red-500');
    } finally {
        loginText.classList.remove('hidden');
        loginSpinner.classList.add('hidden');
    }
}

export function logout() {
    apiService.removeAuthToken();
    window.location.href = 'index.html';
}

export function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}