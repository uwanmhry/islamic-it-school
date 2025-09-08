// ===============================
// Configuration & Constants
// ===============================
const CONFIG = {
  API_BASE_URL: 'https://iis.portalsi.com/api',
  ONGKIR: 15000,
  DISCOUNT_RATE: 0.95, // 5% discount
  MESSAGE_TIMEOUT: 5000,
  PAYMENT_REDIRECT_DELAY: 3000
};

// ===============================
// Application State
// ===============================
class PaymentFormState {
  constructor() {
    this.bookTitle = '';
    this.price = 0;
    this.referralCode = '';
    this.isReferralValid = false;
    this.referralValidated = false;
    this.elements = {};
    this.init();
  }

  init() {
    this.parseUrlParams();
    this.cacheElements();
    this.validateInitialData();
  }

  parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    this.bookTitle = urlParams.get('book_title')?.trim() || '';
    this.price = Math.max(0, parseFloat(urlParams.get('price')) || 0);
    this.referralCode = urlParams.get('ref')?.trim() || '';
  }

  cacheElements() {
    const elementIds = [
      'book_title', 'price', 'referral_code', 'judulDisplay', 
      'hargaAsliDisplay', 'refDisplay', 'input_referral', 
      'validateRefBtn', 'purchaseForm', 'submitBtn', 'diskonInfo', 
      'refErrorInfo', 'is_referral_valid', 'hargaFinalDisplay', 
      'hargaFinal'
    ];
    
    elementIds.forEach(id => {
      this.elements[id] = document.getElementById(id);
    });
  }

  validateInitialData() {
    if (!this.bookTitle || this.price <= 0) {
      this.showErrorPage();
      return false;
    }
    return true;
  }

  showErrorPage() {
    document.body.innerHTML = `
      <div class="min-h-screen flex items-center justify-center p-6">
        <div class="max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 class="text-xl font-bold text-red-600 mb-4">Error</h1>
          <p class="text-gray-600">Parameter buku tidak valid. Silakan kembali ke halaman sebelumnya.</p>
          <button onclick="window.history.back()" 
                  class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Kembali
          </button>
        </div>
      </div>
    `;
  }
}

// ===============================
// API Service
// ===============================
class ApiService {
  static async validateReferral(refCode) {
    if (!refCode?.trim()) {
      throw new Error('Kode referral tidak boleh kosong');
    }

    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/referral/check/${encodeURIComponent(refCode)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Silakan coba lagi.');
      }
      throw error;
    }
  }

  static async createPayment(paymentData) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(paymentData),
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });

      if (!response.ok) {
        let errorMessage = 'Gagal membuat transaksi pembayaran.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.warn('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Silakan coba lagi.');
      }
      throw error;
    }
  }
}

// ===============================
// Form Handler
// ===============================
class PaymentFormHandler {
  constructor(state) {
    this.state = state;
    this.messageElement = null;
  }

  initialize() {
    if (!this.state.validateInitialData()) return;
    
    this.populateFormFields();
    this.setupEventListeners();
    this.handleInitialReferral();
  }

  populateFormFields() {
    const { elements, bookTitle, price, referralCode } = this.state;
    
    elements.book_title.value = bookTitle;
    elements.price.value = price;
    elements.referral_code.value = referralCode;
    elements.judulDisplay.textContent = bookTitle;
    elements.hargaAsliDisplay.textContent = this.formatCurrency(price);
    elements.refDisplay.textContent = this.getReferralDisplay(referralCode);
  }

  getReferralDisplay(refCode) {
    return (refCode && refCode !== 'NO_REF') ? refCode : '-';
  }

  setupEventListeners() {
    const { elements } = this.state;

    // Referral validation
    elements.validateRefBtn.addEventListener('click', () => this.handleReferralValidation());
    
    // Enter key support for referral input
    elements.input_referral.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleReferralValidation();
      }
    });

    // Form submission
    elements.purchaseForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Input validation
    this.setupInputValidation();
  }

  setupInputValidation() {
    // Phone number validation
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d+\-\s]/g, '');
      });
    }

    // Postal code validation
    const postalInput = document.querySelector('input[name="kode_pos"]');
    if (postalInput) {
      postalInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
      });
    }
  }

  handleInitialReferral() {
    const { referralCode } = this.state;
    
    if (referralCode && referralCode.trim() !== '' && referralCode !== 'NO_REF') {
      this.state.elements.input_referral.value = referralCode;
      this.validateReferralCode(referralCode);
    } else {
      this.updatePriceDisplay(false);
      this.state.referralValidated = true;
    }
  }

  async handleReferralValidation() {
    const inputRef = this.state.elements.input_referral.value.trim();
    
    if (!inputRef) {
      this.showMessage('Masukkan kode referral terlebih dahulu!', 'warning');
      return;
    }

    this.state.referralCode = inputRef;
    this.state.elements.referral_code.value = inputRef;
    this.state.elements.refDisplay.textContent = inputRef;
    
    await this.validateReferralCode(inputRef);
  }

  async validateReferralCode(refCode) {
    const { elements } = this.state;
    const { diskonInfo, refErrorInfo, validateRefBtn } = elements;

    try {
      // Reset UI state
      this.resetReferralUI();
      this.setButtonLoading(validateRefBtn, true, '...');

      const result = await ApiService.validateReferral(refCode);

      if (result.valid === true) {
        this.handleValidReferral(result);
      } else {
        this.handleInvalidReferral(result);
      }

    } catch (error) {
      console.error('Referral validation error:', error);
      this.handleReferralError(error.message);
    } finally {
      this.setButtonLoading(validateRefBtn, false, 'Cek');
      this.state.referralValidated = true;
    }
  }

  resetReferralUI() {
    const { diskonInfo, refErrorInfo } = this.state.elements;
    diskonInfo.classList.add('hidden');
    refErrorInfo.classList.add('hidden');
  }

  handleValidReferral(result) {
    this.state.isReferralValid = true;
    this.state.elements.is_referral_valid.value = 'true';
    this.state.elements.diskonInfo.classList.remove('hidden');
    this.updatePriceDisplay(true);
    this.showMessage(`✅ ${result.message} - Owner: ${result.owner}`, 'success');
  }

  handleInvalidReferral(result) {
    this.state.isReferralValid = false;
    this.state.elements.is_referral_valid.value = 'false';
    this.state.elements.refErrorInfo.classList.remove('hidden');
    this.updatePriceDisplay(false);
    this.showMessage('❌ ' + (result.message || 'Kode referral tidak valid.'), 'error');
  }

  handleReferralError(errorMessage) {
    this.state.isReferralValid = false;
    this.state.elements.is_referral_valid.value = 'false';
    this.state.elements.refErrorInfo.classList.remove('hidden');
    this.updatePriceDisplay(false);
    this.showMessage(`⚠️ ${errorMessage}`, 'warning');
  }

  updatePriceDisplay(hasValidDiscount) {
    const { price } = this.state;
    const { hargaFinalDisplay, hargaFinal } = this.state.elements;
    
    const discountedPrice = hasValidDiscount ? 
      Math.round(price * CONFIG.DISCOUNT_RATE) : price;
    const finalPrice = discountedPrice ;
    
    hargaFinalDisplay.textContent = this.formatCurrency(finalPrice);
    
    // Update styling
    hargaFinal.className = hasValidDiscount ? 
      'text-green-600 font-semibold' : 'text-blue-800 font-semibold';
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    if (!this.validateForm(e.target)) return;

    this.setButtonLoading(this.state.elements.submitBtn, true, 'Memproses...');

    try {
      const paymentData = this.buildPaymentData(new FormData(e.target));
      const result = await ApiService.createPayment(paymentData);
      
      this.handlePaymentSuccess(result);
    } catch (error) {
      console.error('Payment error:', error);
      this.showMessage(`❌ ${error.message}`, 'error');
    } finally {
      this.setButtonLoading(this.state.elements.submitBtn, false, 'Bayar Sekarang');
    }
  }

  validateForm(form) {
    const formData = new FormData(form);
    const requiredFields = ['buyer_name', 'address', 'kode_pos', 'phone'];
    
    for (const field of requiredFields) {
      if (!formData.get(field)?.trim()) {
        this.showMessage('Harap isi semua field yang wajib!', 'error');
        return false;
      }
    }

    // Phone validation
    const phone = formData.get('phone').trim();
    if (phone.length < 10) {
      this.showMessage('Nomor telepon harus minimal 10 digit!', 'error');
      return false;
    }

    // Postal code validation
    const kodePos = formData.get('kode_pos').trim();
    if (kodePos.length !== 5) {
      this.showMessage('Kode pos harus 5 digit!', 'error');
      return false;
    }

    return true;
  }

  buildPaymentData(formData) {
    const { price, referralCode, isReferralValid } = this.state;
    
    const alamat = formData.get('address').trim();
    const kodePos = formData.get('kode_pos').trim();
    const alamatLengkap = `${alamat}, ${kodePos}`;

    return {
      book_title: formData.get('book_title'),
      buyer_name: formData.get('buyer_name').trim(),
      address: alamatLengkap,
      email: formData.get('email')?.trim() || "noemail@example.com",
      phone: formData.get('phone').trim(),
      original_price: price,
      referral_code: (referralCode && isReferralValid) ? referralCode : null,
      discounted_price: isReferralValid ? Math.round(price * 0.95) : price,
      ongkir: CONFIG.ONGKIR
    };
  }

  handlePaymentSuccess(result) {
    console.log('Payment response:', result);

    // Store order ID for success page
    if (result.order_id) {
      try {
        localStorage.setItem('last_order_id', result.order_id);
      } catch (e) {
        console.warn('Failed to store order ID:', e);
      }
    }

    if (!result.snap_token) {
      throw new Error('Token pembayaran tidak diterima dari server.');
    }

    this.initiateMidtransPayment(result.snap_token);
  }

  initiateMidtransPayment(snapToken) {
    if (typeof window.snap === 'undefined') {
      throw new Error('Midtrans Snap tidak tersedia. Silakan refresh halaman.');
    }

    window.snap.pay(snapToken, {
      onSuccess: (result) => {
        console.log('Payment success:', result);
        this.showMessage('✅ Pembayaran berhasil! Terima kasih atas pembelian Anda.', 'success');
        setTimeout(() => {
          window.location.href = '/payment-success.html';
        }, CONFIG.PAYMENT_REDIRECT_DELAY);
      },
      onPending: (result) => {
        console.log('Payment pending:', result);
        this.showMessage('⏳ Pembayaran pending. Silakan selesaikan pembayaran Anda.', 'warning');
      },
      onError: (result) => {
        console.log('Payment error:', result);
        this.showMessage('❌ Terjadi kesalahan dalam proses pembayaran.', 'error');
      },
      onClose: () => {
        console.log('Payment popup closed');
        this.showMessage('ℹ️ Jendela pembayaran ditutup. Anda dapat melanjutkan pembayaran kapan saja.', 'warning');
      }
    });
  }

  // Utility methods
  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID').format(amount);
  }

  setButtonLoading(button, isLoading, text) {
    if (!button) return;
    button.disabled = isLoading;
    button.textContent = text;
  }

  showMessage(message, type = 'info') {
    if (!this.messageElement) {
      this.messageElement = document.createElement('div');
      this.messageElement.id = 'resultMessage';
      this.state.elements.purchaseForm.appendChild(this.messageElement);
    }

    const colorClasses = {
      success: 'text-green-700 bg-green-100 border border-green-300',
      warning: 'text-yellow-700 bg-yellow-100 border border-yellow-300',
      error: 'text-red-700 bg-red-100 border border-red-300',
      info: 'text-blue-700 bg-blue-100 border border-blue-300'
    };

    this.messageElement.textContent = message;
    this.messageElement.className = `mt-4 text-sm text-center p-3 rounded-lg transition-all duration-300 ${colorClasses[type] || colorClasses.info}`;

    // Auto-hide for non-error messages
    if (type !== 'error') {
      setTimeout(() => {
        if (this.messageElement) {
          this.messageElement.classList.add('opacity-0');
          setTimeout(() => {
            if (this.messageElement) {
              this.messageElement.remove();
              this.messageElement = null;
            }
          }, 300);
        }
      }, CONFIG.MESSAGE_TIMEOUT);
    }
  }
}

// ===============================
// Application Initialization
// ===============================
class PaymentFormApp {
  constructor() {
    this.state = new PaymentFormState();
    this.formHandler = new PaymentFormHandler(this.state);
  }

  init() {
    this.checkDependencies();
    this.formHandler.initialize();
  }

  checkDependencies() {
    window.addEventListener('load', () => {
      if (typeof window.snap === 'undefined') {
        console.error('Midtrans Snap.js failed to load');
        this.formHandler.showMessage('❌ Gagal memuat sistem pembayaran. Silakan refresh halaman.', 'error');
      }
    });
  }
}

// ===============================
// Start Application
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const app = new PaymentFormApp();
  app.init();
});