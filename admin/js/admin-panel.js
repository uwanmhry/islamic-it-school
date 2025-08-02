// Admin Panel JavaScript - Enhanced Version
// API Configuration
const API_BASE = 'https://iis.dreamapps.id/api';
const PAGE_SIZE = 10;

// Global state
let allLogs = [];
let filteredLogs = [];
let allCodes = [];
let filteredCodes = [];
let rekapData = [];
let filteredRekapData = [];
let currentLogsPage = 1;
let currentCodesPage = 1;
let currentRekapPage = 1;
let currentTab = 'logs';
let deleteTargetId = null;
let allData = [];

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
  await verifyAdminToken();
  setupEventListeners();
  loadLogs();
  loadReferralCodes();
});

// Authentication
async function verifyAdminToken() {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/admin-only`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Token tidak valid atau kadaluarsa');
    }

    const data = await response.json();
    console.log('Admin terverifikasi:', data);
  } catch (err) {
    console.error(err.message);
    localStorage.removeItem('admin_token');
    window.location.href = 'login.html';
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // Search inputs
  document.getElementById('search-input').addEventListener('input', handleLogsSearch);
  document.getElementById('search-codes').addEventListener('input', handleCodesSearch);
  
  // Status filter
  document.getElementById('status-filter').addEventListener('change', handleLogsFilter);
  
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
  } else if (tabName === 'codes' && allCodes.length === 0) {
    loadReferralCodes();
  } else if (tabName === 'rekap') {
    loadRekapData();
  }
}

// Logs Management
async function loadLogs() {
  try {
    const response = await fetch(`${API_BASE}/logs`);
    if (!response.ok) throw new Error('Failed to fetch logs');
    
    allLogs = await response.json();
    filteredLogs = [...allLogs];
    updateStats();
    renderLogsTable();
  } catch (error) {
    console.error('Error loading logs:', error);
    showToast('error', 'Error', 'Gagal memuat data logs');
    renderLogsError();
  }
}

function updateStats() {
  const totalBeli = allLogs.filter(log => log.status === 'beli').length;
  const totalBelum = allLogs.filter(log => log.status === 'belum beli').length;
  
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

    return `
      <tr class="table-row slide-in">
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="text-sm font-mono text-gray-800">#${log.id}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="text-sm font-mono font-semibold text-gray-800">${log.referral_code || '-'}</span>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm space-y-1">
            <div class="text-gray-800 font-medium">${log.book_title || '-'}</div>
            ${log.nama_pembeli ? `<div class="text-gray-600 text-xs">👤 ${log.nama_pembeli}</div>` : ''}
            ${log.nomor_pembeli ? `<div class="text-gray-600 text-xs">📱 ${log.nomor_pembeli}</div>` : ''}
            ${log.alamat ? `<div class="text-gray-600 text-xs">📍 ${log.alamat}</div>` : ''}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="text-sm text-gray-800">${log.harga ? formatCurrency(log.harga) : '-'}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="status-badge px-3 py-1 text-xs font-semibold rounded-full ${log.status === 'beli' ? 'status-beli' : 'status-belum'}">
            ${log.status === 'beli' ? '✓ Beli' : '⏳ Belum Beli'}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-800">${dateText}</div>
          <div class="text-xs text-gray-500">${timeText}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <button onclick="openEditModal(${log.id}, '${log.referral_code}', '${log.status}')" class="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:shadow-lg transition-all flex items-center space-x-1">
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

function handleLogsSearch() {
  applyLogsFilter();
}

function handleLogsFilter() {
  applyLogsFilter();
}

function applyLogsFilter() {
  const statusFilter = document.getElementById('status-filter').value;
  const query = document.getElementById('search-input').value.toLowerCase();

  filteredLogs = allLogs.filter(log => {
    const matchesStatus = statusFilter ? log.status === statusFilter : true;
    const matchesSearch = !query || 
      log.referral_code?.toLowerCase().includes(query) ||
      log.nama_pembeli?.toLowerCase().includes(query) ||
      log.book_title?.toLowerCase().includes(query) ||
      log.nomor_pembeli?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  currentLogsPage = 1;
  renderLogsTable();
}

// Referral Codes Management
async function loadReferralCodes() {
  try {
    const response = await fetch(`${API_BASE}/referal`);
    if (!response.ok) throw new Error('Failed to fetch referral codes');
    
    const codes = await response.json();
    allCodes = codes;
    allData = codes;
    filteredCodes = [...allCodes];
    renderCodesTable();
  } catch (error) {
    console.error('Error loading referral codes:', error);
    showToast('error', 'Error', 'Gagal memuat data kode referral');
    renderCodesError();
  }
}

function renderCodesTable() {
  const tbody = document.getElementById('codes-tbody');
  const start = (currentCodesPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageData = filteredCodes.slice(start, end);

  if (filteredCodes.length === 0) {
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

  tbody.innerHTML = pageData.map(code => {
    const createdAt = code.created_at ? new Date(code.created_at) : null;
    const dateText = createdAt ? createdAt.toLocaleDateString('id-ID') : '-';
    const timeText = createdAt ? createdAt.toLocaleTimeString('id-ID') : '-';

    return `
      <tr class="table-row slide-in">
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="text-sm font-mono text-gray-800">#${code.id}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="text-sm font-mono font-semibold text-gray-800">${code.kode_referal}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="text-sm text-gray-800">${code.username}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-800">${dateText}</div>
          <div class="text-xs text-gray-500">${timeText}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
            ${code.usage || 0} kali
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <button onclick="openDeleteModal(${code.id}, '${code.kode_referal}')" class="btn-danger px-3 py-1.5 text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all flex items-center space-x-1">
            <i class='bx bx-trash text-xs'></i><span>Hapus</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  renderCodesPagination();
}

function renderCodesPagination() {
  const paginationEl = document.getElementById('codes-pagination');
  const totalPages = Math.ceil(filteredCodes.length / PAGE_SIZE);

  if (totalPages <= 1) {
    paginationEl.innerHTML = '';
    return;
  }

  let buttons = '';
  buttons += `<button onclick="changeCodesPage(${currentCodesPage - 1})" class="pagination-btn ${currentCodesPage === 1 ? 'text-gray-400' : 'text-teal-600 hover:bg-gray-100'}" ${currentCodesPage === 1 ? 'disabled' : ''}>Prev</button>`;

  for (let i = 1; i <= totalPages; i++) {
    buttons += `<button onclick="changeCodesPage(${i})" class="pagination-btn ${i === currentCodesPage ? 'bg-teal-500 text-white' : 'text-teal-600 hover:bg-gray-100'}">${i}</button>`;
  }

  buttons += `<button onclick="changeCodesPage(${currentCodesPage + 1})" class="pagination-btn ${currentCodesPage === totalPages ? 'text-gray-400' : 'text-teal-600 hover:bg-gray-100'}" ${currentCodesPage === totalPages ? 'disabled' : ''}>Next</button>`;

  paginationEl.innerHTML = `<div class="flex justify-center items-center py-4">${buttons}</div>`;
}

function changeCodesPage(page) {
  const totalPages = Math.ceil(filteredCodes.length / PAGE_SIZE);
  if (page < 1 || page > totalPages) return;
  currentCodesPage = page;
  renderCodesTable();
}

function renderCodesError() {
  document.getElementById('codes-tbody').innerHTML = `
    <tr>
      <td colspan="6" class="px-6 py-12 text-center">
        <div class="flex flex-col items-center space-y-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <i class='bx bx-error text-red-500 text-xl'></i>
          </div>
          <p class="text-gray-600">Gagal memuat data</p>
          <button onclick="loadReferralCodes()" class="btn-primary px-4 py-2 text-white rounded-lg text-sm">
            Coba Lagi
          </button>
        </div>
      </td>
    </tr>
  `;
}

function handleCodesSearch() {
  const query = document.getElementById('search-codes').value.toLowerCase();
  
  filteredCodes = allCodes.filter(code => 
    code.kode_referal.toLowerCase().includes(query) ||
    code.username.toLowerCase().includes(query)
  );

  currentCodesPage = 1;
  renderCodesTable();
}

async function handleAddCode(e) {
  e.preventDefault();
  
  const kodeReferal = document.getElementById('new-kode-referal').value.trim();
  const username = document.getElementById('new-username').value.trim();
  
  if (!kodeReferal || !username) {
    showToast('error', 'Error', 'Semua field harus diisi');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/referal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        kode_referal: kodeReferal,
        username: username
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal menambah kode referral');
    }

    showToast('success', 'Berhasil', 'Kode referral berhasil ditambahkan');
    document.getElementById('add-code-form').reset();
    loadReferralCodes();
  } catch (error) {
    console.error('Error adding referral code:', error);
    showToast('error', 'Error', error.message);
  }
}

// Rekap Data Management
async function loadRekapData() {
  try {
    showRekapLoading();
    
    // Load both logs and codes if not already loaded
    if (allLogs.length === 0) {
      await loadLogs();
    }
    if (allCodes.length === 0) {
      await loadReferralCodes();
    }
    
    // Process rekap data
    processRekapData();
    updateRekapStats();
    renderRekapTable();
  } catch (error) {
    console.error('Error loading rekap data:', error);
    showToast('error', 'Error', 'Gagal memuat data rekap');
    renderRekapError();
  }
}

function processRekapData() {
  // Filter only 'beli' status logs
  const beliLogs = allLogs.filter(log => log.status === 'beli');
  
  // Group by referral code
  const groupedData = {};
  
  beliLogs.forEach(log => {
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
    
    // Parse harga (remove currency formatting if any)
    const harga = parseFloat(log.harga?.toString().replace(/[^\d.-]/g, '')) || 0;
    groupedData[code].total_pendapatan += harga;
    
    groupedData[code].transactions.push(log);
    
    // Update last transaction
    const logDate = new Date(log.created_at);
    if (!groupedData[code].last_transaction || logDate > new Date(groupedData[code].last_transaction)) {
      groupedData[code].last_transaction = log.created_at;
    }
  });
  
  // Add username from codes data
  Object.keys(groupedData).forEach(code => {
    const codeData = allCodes.find(c => c.kode_referal === code);
    if (codeData) {
      groupedData[code].username = codeData.username;
    }
  });
  
  // Convert to array and calculate averages
  rekapData = Object.values(groupedData).map(item => ({
    ...item,
    rata_harga: item.total_penjualan > 0 ? item.total_pendapatan / item.total_penjualan : 0
  }));
  
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

// Export functionality
function exportRekapData() {
  try {
    const dataToExport = filteredRekapData.map(item => ({
      'Kode Referral': item.kode_referal,
      'Username': item.username || '-',
      'Total Penjualan': item.total_penjualan,
      'Total Pendapatan': item.total_pendapatan,
      'Rata-rata Harga': item.rata_harga,
      'Transaksi Terakhir': item.last_transaction ? new Date(item.last_transaction).toLocaleDateString('id-ID') : '-'
    }));
    
    exportToCSV(dataToExport, 'rekap-data-pembelian');
    showToast('success', 'Export Berhasil', 'Data rekap berhasil diekspor ke CSV');
  } catch (error) {
    console.error('Error exporting data:', error);
    showToast('error', 'Export Gagal', 'Gagal mengekspor data rekap');
  }
}

function exportToCSV(data, filename) {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Escape values that contain commas or quotes
      return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
        ? `"${value.replace(/"/g, '""')}"` 
        : value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
}

// Modal Management
function openEditModal(id, referralCode, status) {
  document.getElementById('edit-id').value = id;
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
  
  const id = document.getElementById('edit-id').value;
  const status = document.getElementById('edit-status').value;
  
  try {
    const response = await fetch(`${API_BASE}/logs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error('Failed to update');

    showToast('success', 'Berhasil', 'Status berhasil diperbarui');
    closeModal();
    loadLogs();
    
    // Refresh rekap data if on rekap tab
    if (currentTab === 'rekap') {
      loadRekapData();
    }
  } catch (error) {
    console.error('Error updating status:', error);
    showToast('error', 'Error', 'Gagal memperbarui status');
  }
}

async function confirmDelete() {
  if (!deleteTargetId) return;

  try {
    const response = await fetch(`${API_BASE}/referal/${deleteTargetId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete');

    showToast('success', 'Berhasil', 'Kode referral berhasil dihapus');
    closeDeleteModal();
    loadReferralCodes();
    
    // Refresh rekap data if on rekap tab
    if (currentTab === 'rekap') {
      loadRekapData();
    }
  } catch (error) {
    console.error('Error deleting referral code:', error);
    showToast('error', 'Error', 'Gagal menghapus kode referral');
  }
}

// Utility Functions
function refreshData() {
  if (currentTab === 'logs') {
    loadLogs();
    showToast('info', 'Refresh', 'Data logs sedang dimuat ulang...');
  } else if (currentTab === 'codes') {
    loadReferralCodes();
    showToast('info', 'Refresh', 'Data kode referral sedang dimuat ulang...');
  } else if (currentTab === 'rekap') {
    loadRekapData();
    showToast('info', 'Refresh', 'Data rekap sedang dimuat ulang...');
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
  }

  messageEl.textContent = title;
  descriptionEl.textContent = message;
  
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 4000);
}

function handleKeyboardShortcuts(e) {
  if (e.key === 'Escape') {
    closeModal();
    closeDeleteModal();
  }
  if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
    e.preventDefault();
    refreshData();
  }
  if (e.ctrlKey && e.key === 'e') {
    e.preventDefault();
    if (currentTab === 'rekap') {
      exportRekapData();
    }
  }
}