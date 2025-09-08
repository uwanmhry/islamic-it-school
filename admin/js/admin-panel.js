// Admin Panel JavaScript - Enhanced Version
// API Configuration
// const API_BASE = 'https://iis.portalsi.com/api';
const API_BASE = 'http://127.0.0.1:8000/api';
const PAGE_SIZE = 10;

// Global state
let allLogs = [];
let filteredLogs = [];
let allAdmins = [];
let filteredAdmins = [];
let rekapData = [];
let filteredRekapData = [];
let currentLogsPage = 1;
let currentAdminsPage = 1;
let currentRekapPage = 1;
let currentTab = 'logs';
let deleteTargetId = null;

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    await verifyAdminToken();  // ini aja cukup
    setupEventListeners();
});


// Authentication
async function verifyAdminToken() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/user`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Auth gagal");

        const userData = await response.json();
        console.log("👤 User:", userData);

        // Tampilkan nama user di header
        document.getElementById("admin-username").textContent = userData.name;

        if (userData.role === 'super_admin') {
            document.getElementById('tab-codes').classList.remove('hidden');
            document.getElementById('tab-rekap').classList.remove('hidden');
            document.getElementById('register-admin-card').classList.remove('hidden');

            await loadAdminsWithCodes();
            await loadAdminOptions();
            await loadPurchaseLogs(); // <-- ambil semua logs
        } else if (userData.role === 'admin') {
            document.getElementById('admin-referral-section').classList.remove('hidden');
            document.getElementById('tab-codes').classList.add('hidden');
            document.getElementById('tab-rekap').classList.add('hidden');
            // Admin biasa hanya bisa akses referral sendiri
            await loadMyReferral();
            await loadMyLogs();
        }

    } catch (err) {
        console.error("Auth error:", err);
        // window.location.href = "admin-login.html";
    }
}


// Event Listeners Setup
function setupEventListeners() {
    // Tab buttons
    document.getElementById('tab-logs').addEventListener('click', () => switchTab('logs'));
    document.getElementById('tab-codes').addEventListener('click', () => switchTab('codes'));
    document.getElementById('tab-rekap').addEventListener('click', () => switchTab('rekap'));
    
    // Search inputs
    document.getElementById('search-input').addEventListener('input', applyLogsFilter);
    document.getElementById('search-codes').addEventListener('input', applyCodesFilter);
    
    // Status filter
    document.getElementById('status-filter').addEventListener('change', applyLogsFilter);
    
    // Forms
    document.getElementById('edit-form').addEventListener('submit', handleEditSubmit);
    document.getElementById('add-code-form').addEventListener('submit', handleAddCode);
    
    // Date filters for rekap
    document.getElementById('date-from').addEventListener('change', applyDateFilter);
    document.getElementById('date-to').addEventListener('change', applyDateFilter);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Modal click outside
    document.getElementById('edit-modal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    document.getElementById('delete-modal').addEventListener('click', function(e) {
        if (e.target === this) closeDeleteModal();
    });
     const registerForm = document.getElementById('register-admin-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterAdmin);
    }
}

document.getElementById('logout-btn')?.addEventListener('click', async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        localStorage.removeItem('access_token');
        window.location.href = "admin-login.html"; 
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            showToast('success', 'Logout', 'Anda berhasil logout');
        } else {
            showToast('error', 'Error', 'Gagal logout di server');
        }
    } catch (err) {
        console.error("⚠️ Error logout:", err);
    } finally {
        // Hapus token dan redirect ke login
        localStorage.removeItem('access_token');
        window.location.href = "login.html";
    }
});



async function handleRegisterAdmin(e) {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    // Simple validation
    if (!name || !email || !password) {
        showToast('error', 'Error', 'Semua field harus diisi');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/admin/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation: password // konfirmasi password sama
            })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Gagal menambahkan admin');

        showToast('success', 'Berhasil', result.message || 'Admin baru berhasil dibuat');
        document.getElementById('register-admin-form').reset();
        await loadAdminsWithCodes(); // refresh daftar admin
    } catch (err) {
        showToast('error', 'Error', err.message);
    } finally {
        submitBtn.disabled = false; // enable kembali
    }
    
}

async function loadMyReferral() {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE}/referral`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    console.log("📦 Referral saya:", data);

    // tampilkan ke card referral
    document.getElementById("referral-code").textContent = data.referral_code;
    document.getElementById("referral-usage").textContent = data.usage_count;
}

async function loadMyLogs() {
    const token = localStorage.getItem('access_token');
    try {
        const response = await fetch(`${API_BASE}/referral/logs`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Gagal ambil logs");

        const data = await response.json();
        console.log("📦 Log referral saya:", data);

        const tbody = document.getElementById('my-logs-table-body');
        tbody.innerHTML = '';

        if (!data.data || data.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-500">Belum ada data</td></tr>`;
            return;
        }

        data.data.forEach(log => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="border px-4 py-2">${log.order_id}</td>
                <td class="border px-4 py-2">${log.buyer_name}</td>
                <td class="border px-4 py-2">${log.payment_status}</td>
                <td class="border px-4 py-2">${new Date(log.created_at).toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("⚠️ Error loadMyLogs:", err);
    }
}


function renderLogs(logs) {
    const tbody = document.getElementById('logs-table-body');
    tbody.innerHTML = '';

    logs.forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${log.order_id}</td>
            <td>${log.buyer_name}</td>
            <td>${log.referral_code_id}</td>
            <td>${log.payment_status}</td>
            <td>${log.created_at}</td>
            <td>
                ${userRole === 'super_admin' 
                    ? `<button onclick="editLogStatus('${log.order_id}')">Edit</button>` 
                    : `-`}
            </td>
        `;
        tbody.appendChild(tr);
    });
}



// Tab Management
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('text-gray-600', 'hover:bg-gray-100');
    });
    
    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.remove('text-gray-600', 'hover:bg-gray-100');
    
    // Show/hide content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
    currentTab = tabName;
    
    // Load data if needed
    if (tabName === 'logs' && allLogs.length === 0) {
        loadLogs();
    } else if (tabName === 'codes' && allAdmins.length === 0) {
        loadAdminsWithCodes();
    } else if (tabName === 'rekap') {
        loadRekapData();
    }
}

// Logs Management
async function loadLogs() {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
        showLogsLoading();
        
        const response = await fetch(`${API_BASE}/admin/purchase-logs`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch logs`);
        }
        
        const result = await response.json();
        allLogs = result.data || [];
        filteredLogs = [...allLogs];
        updateLogsStats();
        renderLogsTable();
        
    } catch (error) {
        console.error('Error loading logs:', error);
        showToast('error', 'Error', 'Gagal memuat data logs: ' + error.message);
        renderLogsError();
    }
}

function showLogsLoading() {
    document.getElementById('logs-tbody').innerHTML = `
        <tr>
            <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center space-y-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-teal-500 rounded-full flex items-center justify-center loading">
                        <i class='bx bx-loader-alt text-white text-xl'></i>
                    </div>
                    <p class="text-gray-600">Memuat data...</p>
                </div>
            </td>
        </tr>
    `;
}

function updateLogsStats() {
    const totalBeli = allLogs.filter(log => log.payment_status === 'success').length;
    const totalBelum = allLogs.filter(log => log.payment_status !== 'success').length;
    
    document.getElementById('total-beli').textContent = totalBeli;
    document.getElementById('total-belum').textContent = totalBelum;
    document.getElementById('total-all').textContent = allLogs.length;
}

function renderLogsTable() {
    const tbody = document.getElementById('logs-tbody');
    const start = (currentLogsPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageData = filteredLogs.slice(start, end);

    if (filteredLogs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center space-y-4">
                        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <i class='bx bx-search text-gray-400 text-xl'></i>
                        </div>
                        <p class="text-gray-600">Tidak ada data yang ditemukan</p>
                    </div>
                </td>
            </tr>
        `;
        document.getElementById('logs-pagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = pageData.map(log => {
        const createdAt = log.created_at ? new Date(log.created_at) : null;
        const dateText = createdAt ? createdAt.toLocaleDateString('id-ID') : '-';
        const timeText = createdAt ? createdAt.toLocaleTimeString('id-ID') : '-';
        const statusClass = log.payment_status === 'success' ? 'status-beli' : 'status-belum';
        const statusText = log.payment_status === 'success' ? '✓ Berhasil' : '⏳ Pending';
        const orderId = log.order_id || `#${log.id}`;
        
        return `
            <tr class="table-row slide-in">
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-mono text-gray-800">${orderId}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-mono font-semibold text-gray-800">${log.referral_code || '-'}</span>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm space-y-1">
                        <div class="text-gray-800 font-medium">${log.book_title || 'Tidak tersedia'}</div>
                        ${log.buyer_name ? `<div class="text-gray-600 text-xs">👤 ${log.buyer_name}</div>` : ''}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-800">${log.amount ? formatCurrency(log.amount) : '-'}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge px-3 py-1 text-xs font-semibold rounded-full ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-800">${dateText}</div>
                    <div class="text-xs text-gray-500">${timeText}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button onclick="openEditModal('${log.order_id}', '${log.referral_code || ''}', '${log.payment_status}')" class="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:shadow-lg transition-all flex items-center space-x-1">
                        <i class='bx bx-edit text-xs'></i><span>Edit</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    renderLogsPagination();
}

function renderLogsPagination() {
    const paginationEl = document.getElementById('logs-pagination');
    const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);

    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }

    let buttons = '';
    buttons += `<button onclick="changeLogsPage(${currentLogsPage - 1})" class="pagination-btn ${currentLogsPage === 1 ? 'text-gray-400' : 'text-teal-600 hover:bg-gray-100'}" ${currentLogsPage === 1 ? 'disabled' : ''}>Prev</button>`;

    for (let i = 1; i <= totalPages; i++) {
        buttons += `<button onclick="changeLogsPage(${i})" class="pagination-btn ${i === currentLogsPage ? 'bg-teal-500 text-white' : 'text-teal-600 hover:bg-gray-100'}">${i}</button>`;
    }

    buttons += `<button onclick="changeLogsPage(${currentLogsPage + 1})" class="pagination-btn ${currentLogsPage === totalPages ? 'text-gray-400' : 'text-teal-600 hover:bg-gray-100'}" ${currentLogsPage === totalPages ? 'disabled' : ''}>Next</button>`;

    paginationEl.innerHTML = `<div class="flex justify-center items-center py-4">${buttons}</div>`;
}

function changeLogsPage(page) {
    const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);
    if (page < 1 || page > totalPages) return;
    currentLogsPage = page;
    renderLogsTable();
}

function renderLogsError() {
    document.getElementById('logs-tbody').innerHTML = `
        <tr>
            <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center space-y-4">
                    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <i class='bx bx-error text-red-500 text-xl'></i>
                    </div>
                    <p class="text-gray-600">Gagal memuat data</p>
                    <button onclick="loadLogs()" class="btn-primary px-4 py-2 text-white rounded-lg text-sm">
                        Coba Lagi
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function applyLogsFilter() {
    const statusFilter = document.getElementById('status-filter').value;
    const query = document.getElementById('search-input').value.toLowerCase();

    filteredLogs = allLogs.filter(log => {
        let matchesStatus = true;
        if (statusFilter === 'beli') {
            matchesStatus = log.payment_status === 'success';
        } else if (statusFilter === 'belum beli') {
            matchesStatus = log.payment_status !== 'success';
        }
        
        const matchesSearch = !query || 
            (log.referral_code && log.referral_code.toLowerCase().includes(query)) ||
            (log.buyer_name && log.buyer_name.toLowerCase().includes(query)) ||
            (log.book_title && log.book_title.toLowerCase().includes(query)) ||
            (log.order_id && log.order_id.toLowerCase().includes(query));

        return matchesStatus && matchesSearch;
    });

    currentLogsPage = 1;
    renderLogsTable();
}

// Admin Codes Management
async function loadAdminsWithCodes() {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
        showAdminsLoading();
        
        const response = await fetch(`${API_BASE}/admin/list`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch admins`);
        }
        
        const result = await response.json();
        allAdmins = result.data || [];
        filteredAdmins = [...allAdmins];
        renderAdminsTable();
        
    } catch (error) {
        console.error('Error loading admins:', error);
        showToast('error', 'Error', 'Gagal memuat data admin: ' + error.message);
        renderAdminsError();
    }
}

function showAdminsLoading() {
    document.getElementById('codes-tbody').innerHTML = `
        <tr>
            <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center space-y-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-teal-500 rounded-full flex items-center justify-center loading">
                        <i class='bx bx-loader-alt text-white text-xl'></i>
                    </div>
                    <p class="text-gray-600">Memuat data...</p>
                </div>
            </td>
        </tr>
    `;
}

function renderAdminsTable() {
    const tbody = document.getElementById('codes-tbody');
    const start = (currentAdminsPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageData = filteredAdmins.slice(start, end);

    if (filteredAdmins.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center space-y-4">
                        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <i class='bx bx-search text-gray-400 text-xl'></i>
                        </div>
                        <p class="text-gray-600">Tidak ada data yang ditemukan</p>
                    </div>
                </td>
            </tr>
        `;
        document.getElementById('codes-pagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = pageData.map(admin => {
        const createdAt = admin.created_at ? new Date(admin.created_at) : null;
        const dateText = createdAt ? createdAt.toLocaleDateString('id-ID') : '-';
        const timeText = createdAt ? createdAt.toLocaleTimeString('id-ID') : '-';
        const referralCode = admin.referral_code ? admin.referral_code.code : '-';
        const usageCount = admin.referral_code ? admin.referral_code.usage_count : 0;
        const referralId = admin.referral_code ? admin.referral_code.id : null;
        
        return `
            <tr class="table-row slide-in">
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-mono text-gray-800">#${admin.id}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-mono font-semibold text-gray-800">${referralCode}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                        <div class="text-gray-800 font-medium">${admin.name}</div>
                        <div class="text-gray-500 text-xs">${admin.email}</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-800">${dateText}</div>
                    <div class="text-xs text-gray-500">${timeText}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
                        ${usageCount} kali
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${referralId ? `<button onclick="openDeleteModal(${referralId}, '${referralCode}')" class="btn-danger px-3 py-1.5 text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all flex items-center space-x-1">
                        <i class='bx bx-trash text-xs'></i><span>Hapus</span>
                    </button>` : '<span class="text-gray-400 text-xs">Tidak ada kode</span>'}
                </td>
            </tr>
        `;
    }).join('');

    renderAdminsPagination();
}

function renderAdminsPagination() {
    const paginationEl = document.getElementById('codes-pagination');
    const totalPages = Math.ceil(filteredAdmins.length / PAGE_SIZE);

    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }

    let buttons = '';
    buttons += `<button onclick="changeAdminsPage(${currentAdminsPage - 1})" class="pagination-btn ${currentAdminsPage === 1 ? 'text-gray-400' : 'text-teal-600 hover:bg-gray-100'}" ${currentAdminsPage === 1 ? 'disabled' : ''}>Prev</button>`;

    for (let i = 1; i <= totalPages; i++) {
        buttons += `<button onclick="changeAdminsPage(${i})" class="pagination-btn ${i === currentAdminsPage ? 'bg-teal-500 text-white' : 'text-teal-600 hover:bg-gray-100'}">${i}</button>`;
    }

    buttons += `<button onclick="changeAdminsPage(${currentAdminsPage + 1})" class="pagination-btn ${currentAdminsPage === totalPages ? 'text-gray-400' : 'text-teal-600 hover:bg-gray-100'}" ${currentAdminsPage === totalPages ? 'disabled' : ''}>Next</button>`;

    paginationEl.innerHTML = `<div class="flex justify-center items-center py-4">${buttons}</div>`;
}

function changeAdminsPage(page) {
    const totalPages = Math.ceil(filteredAdmins.length / PAGE_SIZE);
    if (page < 1 || page > totalPages) return;
    currentAdminsPage = page;
    renderAdminsTable();
}

function renderAdminsError() {
    document.getElementById('codes-tbody').innerHTML = `
        <tr>
            <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center space-y-4">
                    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <i class='bx bx-error text-red-500 text-xl'></i>
                    </div>
                    <p class="text-gray-600">Gagal memuat data</p>
                    <button onclick="loadAdminsWithCodes()" class="btn-primary px-4 py-2 text-white rounded-lg text-sm">
                        Coba Lagi
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function applyCodesFilter() {
    const query = document.getElementById('search-codes').value.toLowerCase();
    
    filteredAdmins = allAdmins.filter(admin => 
        admin.name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        (admin.referral_code && admin.referral_code.code.toLowerCase().includes(query)) ||
        (admin.referral_code && admin.referral_code.username.toLowerCase().includes(query))
    );

    currentAdminsPage = 1;
    renderAdminsTable();
}

async function handleAddCode(e) {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const userId = document.getElementById('selected-admin').value;
    const manualCode = document.getElementById('manual-code').value.trim();

    try {
        const response = await fetch(`${API_BASE}/admin/referrals`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                code: manualCode || null
            })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Gagal menambahkan kode');

        showToast('success', 'Berhasil', result.message || 'Kode referral baru berhasil dibuat');
        document.getElementById('add-code-form').reset();
        await loadAdminsWithCodes();
    } catch (err) {
        showToast('error', 'Error', err.message);
    }
}



// Rekap Data Management
async function loadRekapData() {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
        showRekapLoading();
        
        // Load both logs and admins data
        const [logsResponse, adminsResponse] = await Promise.all([
            fetch(`${API_BASE}/admin/purchase-logs`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }),
            fetch(`${API_BASE}/admin/list`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
        ]);
        
        if (!logsResponse.ok) throw new Error('Failed to fetch logs');
        if (!adminsResponse.ok) throw new Error('Failed to fetch admins');
        
        const logsResult = await logsResponse.json();
        const adminsResult = await adminsResponse.json();
        
        allLogs = logsResult.data || [];
        allAdmins = adminsResult.data || [];
        
        processRekapData();
        updateRekapStats();
        renderRekapTable();
        
    } catch (error) {
        console.error('Error loading rekap data:', error);
        showToast('error', 'Error', 'Gagal memuat data rekap: ' + error.message);
        renderRekapError();
    }
}

async function loadAdminOptions() {
    const token = localStorage.getItem('access_token');
    try {
        const response = await fetch(`${API_BASE}/admin/list`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log("📦 Data Admin:", data); // Debug

        const select = document.getElementById('selected-admin');
        if (!select) {
            console.error("❌ Elemen #selected-admin tidak ditemukan di HTML");
            return;
        }

        select.innerHTML = '';

        const admins = data.data || [];
        if (admins.length === 0) {
            const option = document.createElement('option');
            option.disabled = true;
            option.textContent = "Tidak ada admin tersedia";
            select.appendChild(option);
            return;
        }

        admins.forEach(admin => {
            const option = document.createElement('option');
            option.value = admin.id;
            option.textContent = `${admin.name} (${admin.email})`;
            select.appendChild(option);
        });

        // preview auto generate
        generatePreviewCode();
    } catch (err) {
        console.error('Gagal memuat admin:', err.message);
    }
}



function showRekapLoading() {
    document.getElementById('rekap-tbody').innerHTML = `
        <tr>
            <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center space-y-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-teal-500 rounded-full flex items-center justify-center loading">
                        <i class='bx bx-loader-alt text-white text-xl'></i>
                    </div>
                    <p class="text-gray-600">Memuat data rekap...</p>
                </div>
            </td>
        </tr>
    `;
}

function processRekapData() {
    const successLogs = allLogs.filter(log => log.payment_status === 'success');
    const groupedData = {};
    
    // Group logs by referral code
    successLogs.forEach(log => {
        const code = log.referral_code;
        if (!code) return;
        
        if (!groupedData[code]) {
            groupedData[code] = {
                kode_referal: code,
                username: '',
                total_penjualan: 0,
                total_pendapatan: 0,
                transactions: [],
                last_transaction: null
            };
        }
        
        groupedData[code].total_penjualan += 1;
        const harga = parseFloat(log.amount) || 0;
        groupedData[code].total_pendapatan += harga;
        
        groupedData[code].transactions.push(log);
        
        const logDate = new Date(log.created_at);
        if (!groupedData[code].last_transaction || logDate > new Date(groupedData[code].last_transaction)) {
            groupedData[code].last_transaction = log.created_at;
        }
    });
    
    // Add username from admins data
    Object.keys(groupedData).forEach(code => {
        const adminData = allAdmins.find(a => a.referral_code && a.referral_code.code === code);
        if (adminData) {
            groupedData[code].username = adminData.name;
        }
    });
    
    rekapData = Object.values(groupedData).map(item => ({
        ...item,
        rata_harga: item.total_penjualan > 0 ? item.total_pendapatan / item.total_penjualan : 0
    }));
    
    // Sort by total sales descending
    rekapData.sort((a, b) => b.total_penjualan - a.total_penjualan);
    
    filteredRekapData = [...rekapData];
}

function updateRekapStats() {
    const totalBeli = rekapData.reduce((sum, item) => sum + item.total_penjualan, 0);
    const totalPendapatan = rekapData.reduce((sum, item) => sum + item.total_pendapatan, 0);
    const kodeAktif = rekapData.filter(item => item.total_penjualan > 0).length;
    const rataHarga = totalBeli > 0 ? totalPendapatan / totalBeli : 0;
    
    document.getElementById('rekap-total-beli').textContent = totalBeli;
    document.getElementById('rekap-total-pendapatan').textContent = formatCurrency(totalPendapatan);
    document.getElementById('rekap-kode-aktif').textContent = kodeAktif;
    document.getElementById('rekap-rata-harga').textContent = formatCurrency(rataHarga);
}

function renderRekapTable() {
    const tbody = document.getElementById('rekap-tbody');
    const start = (currentRekapPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageData = filteredRekapData.slice(start, end);

    if (filteredRekapData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center space-y-4">
                        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <i class='bx bx-search text-gray-400 text-xl'></i>
                        </div>
                        <p class="text-gray-600">Tidak ada data rekap yang ditemukan</p>
                    </div>
                </td>
            </tr>
        `;
        document.getElementById('rekap-pagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = pageData.map(item => {
        const lastTransaction = item.last_transaction ? new Date(item.last_transaction) : null;
        const lastTransactionText = lastTransaction ? lastTransaction.toLocaleDateString('id-ID') : '-';

        return `
            <tr class="table-row slide-in">
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-mono font-semibold text-gray-800">${item.kode_referal}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-800">${item.username || '-'}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-800">
                        ${item.total_penjualan} transaksi
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-semibold text-gray-800">${formatCurrency(item.total_pendapatan)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-800">${formatCurrency(item.rata_harga)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-800">${lastTransactionText}</span>
                </td>
            </tr>
        `;
    }).join('');

    renderRekapPagination();
}

function renderRekapPagination() {
    const paginationEl = document.getElementById('rekap-pagination');
    const totalPages = Math.ceil(filteredRekapData.length / PAGE_SIZE);

    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }

    let buttons = '';
    buttons += `<button onclick="changeRekapPage(${currentRekapPage - 1})" class="pagination-btn ${currentRekapPage === 1 ? 'text-gray-400' : 'text-teal-600 hover:bg-gray-100'}" ${currentRekapPage === 1 ? 'disabled' : ''}>Prev</button>`;

    for (let i = 1; i <= totalPages; i++) {
        buttons += `<button onclick="changeRekapPage(${i})" class="pagination-btn ${i === currentRekapPage ? 'bg-teal-500 text-white' : 'text-teal-600 hover:bg-gray-100'}">${i}</button>`;
    }

    buttons += `<button onclick="changeRekapPage(${currentRekapPage + 1})" class="pagination-btn ${currentRekapPage === totalPages ? 'text-gray-400' : 'text-teal-600 hover:bg-gray-100'}" ${currentRekapPage === totalPages ? 'disabled' : ''}>Next</button>`;

    paginationEl.innerHTML = `<div class="flex justify-center items-center py-4">${buttons}</div>`;
}

function changeRekapPage(page) {
    const totalPages = Math.ceil(filteredRekapData.length / PAGE_SIZE);
    if (page < 1 || page > totalPages) return;
    currentRekapPage = page;
    renderRekapTable();
}

function renderRekapError() {
    document.getElementById('rekap-tbody').innerHTML = `
        <tr>
            <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center space-y-4">
                    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <i class='bx bx-error text-red-500 text-xl'></i>
                    </div>
                    <p class="text-gray-600">Gagal memuat data rekap</p>
                    <button onclick="loadRekapData()" class="btn-primary px-4 py-2 text-white rounded-lg text-sm">
                        Coba Lagi
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// Date filtering for rekap
function applyDateFilter() {
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    
    if (!dateFrom && !dateTo) {
        filteredRekapData = [...rekapData];
    } else {
        filteredRekapData = rekapData.filter(item => {
            if (!item.last_transaction) return false;
            
            const transactionDate = new Date(item.last_transaction);
            const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
            const toDate = dateTo ? new Date(dateTo) : new Date('2100-12-31');
            
            return transactionDate >= fromDate && transactionDate <= toDate;
        });
    }
    
    currentRekapPage = 1;
    updateRekapStats();
    renderRekapTable();
}

function filterRekapData() {
    applyDateFilter();
    showToast('info', 'Filter Applied', 'Data rekap telah difilter sesuai tanggal');
}

function exportRekapData() {
    if (filteredRekapData.length === 0) {
        showToast('error', 'Error', 'Tidak ada data untuk diekspor');
        return;
    }

    // Create CSV content
    let csvContent = "Kode Referral,Username,Total Penjualan,Total Pendapatan,Rata-rata Harga,Transaksi Terakhir\n";
    
    filteredRekapData.forEach(item => {
        const lastTransaction = item.last_transaction ? new Date(item.last_transaction).toLocaleDateString('id-ID') : '-';
        csvContent += `"${item.kode_referal}","${item.username || '-'}","${item.total_penjualan}","${item.total_pendapatan}","${item.rata_harga}","${lastTransaction}"\n`;
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap-referral-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Export Berhasil', 'Data rekap berhasil diekspor ke CSV');
}

// Modal Management
function openEditModal(orderId, referralCode, status) {
    document.getElementById('edit-id').value = orderId;
    document.getElementById('edit-referral-code').textContent = referralCode;
    document.getElementById('edit-status').value = status;
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

function openDeleteModal(id, kodeReferal) {
    deleteTargetId = id;
    document.getElementById('delete-code-text').textContent = kodeReferal;
    document.getElementById('delete-modal').classList.remove('hidden');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    deleteTargetId = null;
}

async function handleEditSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    const orderId = document.getElementById('edit-id').value;
    const payment_status = document.getElementById('edit-status').value;
    
    try {
        // Note: This endpoint might not exist in the API documentation provided
        // You may need to implement this endpoint on the backend
        const response = await fetch(`${API_BASE}/admin/purchase-logs/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ payment_status })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update');
        }

        const result = await response.json();
        showToast('success', 'Berhasil', result.message || 'Status berhasil diperbarui');
        closeModal();
        await loadLogs();
        
        if (currentTab === 'rekap') {
            await loadRekapData();
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showToast('error', 'Error', 'Gagal memperbarui status: ' + error.message);
    }
}

async function confirmDelete() {
    if (!deleteTargetId) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE}/admin/referrals/${deleteTargetId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete');
        }

        const result = await response.json();
        showToast('success', 'Berhasil', result.message || 'Kode referral berhasil dihapus');
        closeDeleteModal();
        await loadAdminsWithCodes();
        
        if (currentTab === 'rekap') {
            await loadRekapData();
        }
    } catch (error) {
        console.error('Error deleting referral code:', error);
        showToast('error', 'Error', 'Gagal menghapus kode referral: ' + error.message);
    }
}

// Utility Functions
async function refreshData() {
    if (currentTab === 'logs') {
        await loadLogs();
        showToast('info', 'Refresh', 'Data logs telah dimuat ulang');
    } else if (currentTab === 'codes') {
        await loadAdminsWithCodes();
        showToast('info', 'Refresh', 'Data admin telah dimuat ulang');
    } else if (currentTab === 'rekap') {
        await loadRekapData();
        showToast('info', 'Refresh', 'Data rekap telah dimuat ulang');
    }
}

function formatCurrency(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function showToast(type, title, message) {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const messageEl = document.getElementById('toast-message');
    const descriptionEl = document.getElementById('toast-description');

    // Set icon and color based on type
    switch(type) {
        case 'success':
            icon.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-green-100';
            icon.innerHTML = '<i class="bx bx-check text-green-600"></i>';
            break;
        case 'error':
            icon.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-red-100';
            icon.innerHTML = '<i class="bx bx-x text-red-600"></i>';
            break;
        case 'info':
            icon.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-blue-100';
            icon.innerHTML = '<i class="bx bx-info-circle text-blue-600"></i>';
            break;
        case 'warning':
            icon.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-yellow-100';
            icon.innerHTML = '<i class="bx bx-error text-yellow-600"></i>';
            break;
    }

    messageEl.textContent = title;
    descriptionEl.textContent = message;
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}

function handleKeyboardShortcuts(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        closeModal();
        closeDeleteModal();
    }
    
    // Refresh with F5 or Ctrl+R
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        refreshData();
    }
    
    // Export with Ctrl+E
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        if (currentTab === 'rekap') {
            exportRekapData();
        }
    }
    
    // Switch tabs with number keys
    if (e.ctrlKey && e.key >= '1' && e.key <= '3') {
        e.preventDefault();
        const tabNames = ['logs', 'codes', 'rekap'];
        const tabIndex = parseInt(e.key) - 1;
        if (tabNames[tabIndex]) {
            switchTab(tabNames[tabIndex]);
        }
    }
}

// Additional utility functions for better UX
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to search functions for better performance
const debouncedLogsFilter = debounce(applyLogsFilter, 300);
const debouncedCodesFilter = debounce(applyCodesFilter, 300);

// Update event listeners to use debounced functions
document.addEventListener('DOMContentLoaded', () => {
    // Replace the original event listeners with debounced versions
    const searchInput = document.getElementById('search-input');
    const searchCodes = document.getElementById('search-codes');
    
    if (searchInput) {
        searchInput.removeEventListener('input', applyLogsFilter);
        searchInput.addEventListener('input', debouncedLogsFilter);
    }
    
    if (searchCodes) {
        searchCodes.removeEventListener('input', applyCodesFilter);
        searchCodes.addEventListener('input', debouncedCodesFilter);
    }
});

// Auto-refresh data every 5 minutes
setInterval(() => {
    if (document.visibilityState === 'visible') {
        refreshData();
    }
}, 5 * 60 * 1000);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible, refresh data
        refreshData();
    }
});

// Error boundary for uncaught errors
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    showToast('error', 'Error', 'Terjadi kesalahan yang tidak terduga');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('error', 'Error', 'Terjadi kesalahan jaringan');
});

// Initialize tooltips and other UI enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('button[onclick]');
    buttons.forEach(button => {
        const originalOnClick = button.onclick;
        button.onclick = async function(e) {
            const originalText = this.innerHTML;
            const isDisabled = this.disabled;
            
            this.disabled = true;
            this.innerHTML = '<i class="bx bx-loader-alt animate-spin"></i> Loading...';
            
            try {
                await originalOnClick.call(this, e);
            } finally {
                this.disabled = isDisabled;
                this.innerHTML = originalText;
            }
        };
    });
});

// Add smooth scrolling for pagination
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Update pagination functions to include smooth scrolling
const originalChangeLogsPage = changeLogsPage;
changeLogsPage = function(page) {
    originalChangeLogsPage(page);
    smoothScrollToTop();
};

const originalChangeAdminsPage = changeAdminsPage;
changeAdminsPage = function(page) {
    originalChangeAdminsPage(page);
    smoothScrollToTop();
};

const originalChangeRekapPage = changeRekapPage;
changeRekapPage = function(page) {
    originalChangeRekapPage(page);
    smoothScrollToTop();
};