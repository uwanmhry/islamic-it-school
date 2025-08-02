// PRODUCTION CONFIGURATION
const API_BASE_URL = 'https://iis.dreamapps.id'; 
// const API_BASE_URL = 'http://127.0.0.1:8000'; 

// Konstanta ongkir
const ONGKIR = 15000;

// Ambil parameter dari URL
const urlParams = new URLSearchParams(window.location.search);
const bookTitle = urlParams.get('book_title') || 'Judul Buku Tidak Tersedia';
const price = parseFloat(urlParams.get('price')) || 0;
const ref = urlParams.get('ref') || '';

// State untuk validasi referral
let isReferralValid = false;
let referralValidated = false;
let currentReferralCode = ref; // Track kode referral yang sedang aktif

// Validasi parameter dan inisialisasi
function initializeForm() {
  if (!bookTitle || price <= 0) {
    document.body.innerHTML = `
      <div class="min-h-screen flex items-center justify-center p-6">
        <div class="max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 class="text-xl font-bold text-red-600 mb-4">Error</h1>
          <p class="text-gray-600">Parameter buku tidak valid. Silakan kembali ke halaman sebelumnya.</p>
          <button onclick="window.history.back()" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Kembali
          </button>
        </div>
      </div>
    `;
    return;
  }

  // Isi hidden fields
  document.getElementById('book_title').value = bookTitle;
  document.getElementById('price').value = price;
  document.getElementById('referral_code').value = ref;

  // Tampilkan informasi buku awal
  document.getElementById('judulDisplay').textContent = bookTitle;
  document.getElementById('hargaAsliDisplay').textContent = price.toLocaleString('id-ID');
  document.getElementById('ongkirDisplay').textContent = ONGKIR.toLocaleString('id-ID');
  document.getElementById('refDisplay').textContent = (ref && ref !== 'NO_REF') ? ref : '-';
  
  // Set input referral dengan kode dari URL jika ada
  if (ref && ref.trim() !== '' && ref !== 'NO_REF') {
    document.getElementById('input_referral').value = ref;
    validateReferralCode(ref);
  } else {
    // Tidak ada referral, langsung tampilkan harga normal + ongkir
    updatePriceDisplay(price, false);
    referralValidated = true;
  }
}

// Event listener untuk tombol validasi referral
function setupEventListeners() {
  document.getElementById('validateRefBtn').addEventListener('click', function() {
    const inputRef = document.getElementById('input_referral').value.trim();
    
    if (!inputRef) {
      showMessage('Masukkan kode referral terlebih dahulu!', 'warning');
      return;
    }
    
    // Update kode referral yang aktif
    currentReferralCode = inputRef;
    document.getElementById('referral_code').value = inputRef;
    document.getElementById('refDisplay').textContent = inputRef;
    
    // Validasi kode baru
    validateReferralCode(inputRef);
  });

  // Auto-validate saat user mengetik dan menekan Enter
  document.getElementById('input_referral').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('validateRefBtn').click();
    }
  });

  // Validasi real-time untuk nomor telepon
  document.getElementById('nomor_pembeli').addEventListener('input', function(e) {
    const value = e.target.value;
    const isValid = /^[0-9+\-\s]*$/.test(value);
    
    if (!isValid) {
      e.target.setCustomValidity('Hanya boleh menggunakan angka, +, -, dan spasi');
    } else {
      e.target.setCustomValidity('');
    }
  });

  // Validasi real-time untuk kode pos
  document.getElementById('kode_pos').addEventListener('input', function(e) {
    const value = e.target.value;
    const isValid = /^[0-9]*$/.test(value);
    
    if (!isValid) {
      e.target.value = value.replace(/[^0-9]/g, '');
    }
    
    if (value.length !== 5 && value.length > 0) {
      e.target.setCustomValidity('Kode pos harus 5 digit angka');
    } else {
      e.target.setCustomValidity('');
    }
  });

  // Validasi real-time untuk email
  document.getElementById('customer_email').addEventListener('input', function(e) {
    const value = e.target.value;
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      e.target.setCustomValidity('Format email tidak valid');
    } else {
      e.target.setCustomValidity('');
    }
  });

  // Handle form submission
  document.getElementById('purchaseForm').addEventListener('submit', handleFormSubmit);
}

// Fungsi untuk memvalidasi kode referral dengan database
async function validateReferralCode(refCode) {
  const loadingElement = document.getElementById('refValidationLoading');
  const diskonInfo = document.getElementById('diskonInfo');
  const refErrorInfo = document.getElementById('refErrorInfo');
  const validateBtn = document.getElementById('validateRefBtn');
  
  try {
    // Tampilkan loading
    loadingElement.classList.remove('hidden');
    diskonInfo.classList.add('hidden');
    refErrorInfo.classList.add('hidden');
    validateBtn.disabled = true;
    validateBtn.textContent = '...';
    
    const response = await fetch(`${API_BASE_URL}/api/referal`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const referralCodes = await response.json();
    
    // Cek apakah kode referral ada di database
    const validReferral = referralCodes.find(item => 
      item.kode_referal === refCode
    );

    if (validReferral) {
      isReferralValid = true;
      document.getElementById('is_referral_valid').value = 'true';
      diskonInfo.classList.remove('hidden');
      updatePriceDisplay(price, true);
      showMessage('✅ Kode referral valid! Diskon 5% telah diterapkan.', 'success');
    } else {
      isReferralValid = false;
      document.getElementById('is_referral_valid').value = 'false';
      refErrorInfo.classList.remove('hidden');
      updatePriceDisplay(price, false);
      showMessage('❌ Kode referral tidak valid. Silakan periksa kembali.', 'error');
    }
    
  } catch (error) {
    console.error('Error validating referral code:', error);
    isReferralValid = false;
    document.getElementById('is_referral_valid').value = 'false';
    refErrorInfo.classList.remove('hidden');
    updatePriceDisplay(price, false);
    
    // Tampilkan pesan error jika gagal koneksi ke server
    showMessage('⚠️ Gagal memvalidasi kode referral. Pembelian akan dilanjutkan tanpa diskon.', 'warning');
  } finally {
    loadingElement.classList.add('hidden');
    validateBtn.disabled = false;
    validateBtn.textContent = 'Cek';
    referralValidated = true;
  }
}

// Fungsi untuk update tampilan harga
function updatePriceDisplay(originalPrice, hasValidDiscount) {
  const discountedPrice = hasValidDiscount ? Math.round(originalPrice * 0.95) : originalPrice;
  const finalPrice = discountedPrice + ONGKIR;
  
  document.getElementById('hargaFinalDisplay').textContent = finalPrice.toLocaleString('id-ID');
  
  const hargaFinalElement = document.getElementById('hargaFinal');
  if (hasValidDiscount) {
    hargaFinalElement.classList.add('text-green-600');
    hargaFinalElement.classList.remove('text-blue-800');
  } else {
    hargaFinalElement.classList.remove('text-green-600');
    hargaFinalElement.classList.add('text-blue-800');
  }
}

// Fungsi untuk menambah usage referral code
async function incrementReferralUsage(refCode) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/referal/use/${refCode}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Referral usage incremented:', result.message);
    
  } catch (error) {
    console.error('Error incrementing referral usage:', error);
    // Jangan hentikan proses pembelian jika gagal update usage
  }
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();
  
  // Ambil kode referral terbaru dari input
  const inputRefCode = document.getElementById('input_referral').value.trim();
  if (inputRefCode && inputRefCode !== currentReferralCode) {
    showMessage('Anda telah mengubah kode referral. Silakan klik "Cek" terlebih dahulu untuk memvalidasi.', 'warning');
    return;
  }
  
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const loadingText = document.getElementById('loadingText');
  const resultMessage = document.getElementById('resultMessage');
  
  // Disable button dan tampilkan loading
  submitBtn.disabled = true;
  submitText.classList.add('hidden');
  loadingText.classList.remove('hidden');
  resultMessage.classList.add('hidden');

  const formData = new FormData(e.target);
  
  // Update referral code dengan yang ada di input
  if (inputRefCode) {
    formData.set('referral_code', inputRefCode);
    currentReferralCode = inputRefCode;
  }

  // Validasi form
  const nama = formData.get('nama_pembeli').trim();
  const alamat = formData.get('alamat').trim();
  const kodePos = formData.get('kode_pos').trim();
  const nomor = formData.get('nomor_pembeli').trim();
  const customerEmail = formData.get('customer_email') ? formData.get('customer_email').trim() : '';
  
  if (!nama || !alamat || !kodePos || !nomor) {
    showMessage('Harap isi semua field yang wajib!', 'error');
    resetButton();
    return;
  }

  // Validasi nomor telepon
  if (!/^[0-9+\-\s]{10,15}$/.test(nomor)) {
    showMessage('Format nomor telepon tidak valid!', 'error');
    resetButton();
    return;
  }

  // Validasi kode pos
  if (!/^[0-9]{5}$/.test(kodePos)) {
    showMessage('Kode pos harus 5 digit angka!', 'error');
    resetButton();
    return;
  }

  // Validasi email jika diisi
  if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    showMessage('Format email tidak valid!', 'error');
    resetButton();
    return;
  }

  const originalPrice = parseFloat(formData.get('price'));
  const referralCode = formData.get('referral_code') || '';
  const isValidReferral = formData.get('is_referral_valid') === 'true';
  
  // Hitung harga final berdasarkan validasi referral
  let bookPrice = originalPrice;
  if (isValidReferral && referralCode.trim() !== '' && referralCode !== 'NO_REF') {
    bookPrice = Math.round(originalPrice * 0.95); // Diskon 5%
  }
  
  const finalPrice = bookPrice + ONGKIR;

  // Gabungkan alamat dengan kode pos
  const alamatLengkap = `${alamat}, ${kodePos}`;

  // Data untuk log-click tanpa order_id dulu
  const logData = {
    book_title: formData.get('book_title'),
    referral_code: referralCode,
    is_referral_valid: isValidReferral,
    user_agent: navigator.userAgent,
    nama_pembeli: nama,
    alamat: alamatLengkap, // Alamat sudah digabung dengan kode pos
    nomor_pembeli: nomor,
    harga: finalPrice,
    harga_asli: originalPrice,
    ongkir: ONGKIR,
    diskon_amount: originalPrice - bookPrice,
    timestamp: new Date().toISOString()
  };

  try {
    // Log ke database dulu
    const response = await fetch(`${API_BASE_URL}/api/log-click`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(logData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success !== false) {
      // Update referral usage jika valid
      if (isValidReferral && referralCode.trim() !== '' && referralCode !== 'NO_REF') {
        await incrementReferralUsage(referralCode);
      }

      // Buat transaksi Midtrans menggunakan Snap Preference
      try {
        const midtransResponse = await fetch(`${API_BASE_URL}/api/midtrans/create-transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nama: nama,
            nomor: nomor,
            alamat: alamatLengkap, // Kirim alamat yang sudah digabung
            amount: finalPrice,
            item_name: formData.get('book_title'),
            referral_code: referralCode,
            customer_email: customerEmail,
            log_id: result.id || result.insertId
          })
        });

        if (!midtransResponse.ok) {
          const errorData = await midtransResponse.json();
          console.error('Midtrans Error Response:', errorData);
          throw new Error(`Midtrans Error: ${errorData.message || midtransResponse.status}`);
        }

        const midtransResult = await midtransResponse.json();

        if (midtransResult.success && midtransResult.token) {
          // Reset button sebelum buka Snap
          resetButton();
          
          // Buka Midtrans Snap popup
          window.snap.pay(midtransResult.token, {
            onSuccess: function(result) {
              console.log('Payment success:', result);
              showMessage('✅ Pembayaran berhasil! Terima kasih atas pembelian Anda.', 'success');
              
              // Optional: redirect ke halaman sukses setelah beberapa detik
              setTimeout(() => {
                window.location.href = '/payment-success.html?order_id=' + midtransResult.order_id;
              }, 3000);
            },
            onPending: function(result) {
              console.log('Payment pending:', result);
              showMessage('⏳ Pembayaran pending. Silakan selesaikan pembayaran Anda.', 'warning');
            },
            onError: function(result) {
              console.log('Payment error:', result);
              showMessage('❌ Terjadi kesalahan saat memproses pembayaran.', 'error');
            },
            onClose: function() {
              console.log('Payment popup closed');
              showMessage('ℹ️ Pembayaran dibatalkan atau ditutup.', 'warning');
            }
          });

        } else {
          showMessage('❌ Gagal membuat transaksi pembayaran: ' + (midtransResult.message || 'Unknown error'), 'error');
        }

      } catch (midtransErr) {
        console.error('Midtrans Error:', midtransErr);
        showMessage('❌ Terjadi kesalahan saat menghubungkan ke sistem pembayaran: ' + midtransErr.message, 'error');
      }
    } else {
      showMessage('❌ Gagal menyimpan data pembelian.', 'error');
    }
    
  } catch (error) {
    console.error('Error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      showMessage('⚠️ Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 'error');
    } else {
      showMessage('❌ Terjadi kesalahan sistem. Silakan coba lagi.', 'error');
    }
  } finally {
    resetButton();
  }
}

// Utility functions
function showMessage(message, type) {
  const resultMessage = document.getElementById('resultMessage');
  resultMessage.textContent = message;
  
  let colorClass;
  switch(type) {
    case 'success':
      colorClass = 'text-green-700 bg-green-100 border border-green-300';
      break;
    case 'warning':
      colorClass = 'text-yellow-700 bg-yellow-100 border border-yellow-300';
      break;
    case 'error':
    default:
      colorClass = 'text-red-700 bg-red-100 border border-red-300';
      break;
  }
  
  resultMessage.className = `mt-4 text-sm text-center p-3 rounded-lg ${colorClass}`;
  resultMessage.classList.remove('hidden');
}

function resetButton() {
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const loadingText = document.getElementById('loadingText');
  
  submitBtn.disabled = false;
  submitText.classList.remove('hidden');
  loadingText.classList.add('hidden');
}

// Handle jika Snap.js gagal dimuat
window.addEventListener('load', function() {
  if (typeof window.snap === 'undefined') {
    console.error('Midtrans Snap.js failed to load');
    showMessage('❌ Gagal memuat sistem pembayaran. Silakan refresh halaman.', 'error');
  }
});

// Initialize saat DOM loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeForm();
  setupEventListeners();
});