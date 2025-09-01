// ===== Color gradient mapping =====
const colorMap = {
  smp: "from-yellow-400 to-yellow-500",
  sma: "from-orange-400 to-orange-500",
  beasiswa: "from-green-400 to-green-500",
  stfq: "from-blue-400 to-blue-500"
};

// ===== Data pendaftaran =====
const dataPendaftaran = {
  pendaftaran: [
    { 
      title: "SMP", 
      description: "Pendaftaran jenjang SMP untuk calon peserta didik baru dengan program unggulan.", 
      icon: "fas fa-user-graduate", 
      color: "smp", 
      buttonText: "Daftar Sekarang",  
      jenjang: "SMP", 
      link: "https://psb.sekolahimpian.com/daftar/" 
    },
    { 
      title: "SMA", 
      description: "Pendaftaran jenjang SMA untuk calon peserta didik baru dengan kurikulum Islami.", 
      icon: "fas fa-university", 
      color: "sma", 
      buttonText: "Daftar Sekarang",  
      jenjang: "SMA", 
      link: "https://psb.sekolahimpian.com/daftar/" 
    },
    { 
      title: "Dhuafa", 
      description: "Pendaftaran SMP dan SMA khusus dhuafa dengan dukungan beasiswa penuh.", 
      icon: "fas fa-hand-holding-heart", 
      color: "beasiswa", 
      buttonText: "Daftar Sekarang",  
      jenjang: "Beasiswa", 
      link: "https://psb.sekolahimpian.com/daftar/" 
    },
    { 
      title: "STFQ", 
      description: "Pendaftaran STFQ bagi lulusan SMA atau sederajat dengan fasilitas beasiswa penuh.", 
      icon: "fas fa-book-open", 
      color: "stfq", 
      buttonText: "Daftar",  
      jenjang: "STFQ", 
      link: "https://wa.me/6285967229172?text=Assalamu'alaikum%20saya%20ingin%20daftar%20STFQ%20Barakallahu%20fiikum",
      linkMore: "https://stfq.org/" 
    }
  ]
};


// ===== Render Tabs (Mobile) =====
function renderTabs() {
  const tabsContainer = document.getElementById("pendaftaran-tabs");
  if (!tabsContainer) return;
  tabsContainer.innerHTML = dataPendaftaran.pendaftaran.map((item, idx) => {
    const gradient = colorMap[item.color];
    return `
      <button 
        class="px-5 py-2 rounded-full font-semibold transition text-sm ${
          idx === 0 ? `bg-gradient-to-r ${gradient} text-white` : "bg-gray-200 text-gray-700"
        }" 
        onclick="setActiveTab('${item.jenjang}', '${item.color}')"
        id="tab-${item.jenjang}"
        type="button"
      >
        ${item.jenjang}
      </button>
    `;
  }).join("");
}

// ===== Render Cards =====
function renderPendaftaranItems(filterJenjang = null) {
  const pendaftaranContainer = document.getElementById('pendaftaran-items');
  if (!pendaftaranContainer) return;
  let itemsHTML = '';

  dataPendaftaran.pendaftaran
    .filter(item => {
      if (window.innerWidth < 640) {
        return !filterJenjang || item.jenjang === filterJenjang; // mobile = 1 card sesuai tab
      }
      return true; // desktop = semua card
    })
    .forEach(item => {
      const gradientClass = colorMap[item.color] || "from-gray-400 to-gray-500";

      // ===== khusus STFQ: awalnya 1 button (ketika diklik -> jadi 2 tombol) =====
      let buttonHTML = `
        <a href="${item.link}" target="_blank" 
          class="block w-full text-center bg-gradient-to-r ${gradientClass} hover:opacity-95 text-white px-6 py-4 rounded-xl font-semibold shadow-md transition text-lg tracking-wide">
          ${item.buttonText}
        </a>
      `;

      if (item.jenjang === "STFQ") {
        // encodeURIComponent agar atribut data aman dari karakter spesial
        const safeDaftar = encodeURIComponent(item.link || '#');
        const safeMore   = encodeURIComponent(item.linkMore || '#');

        buttonHTML = `
          <button
            type="button"
            data-stfq-toggle="true"
            data-gradient="${gradientClass}"
            data-daftar="${safeDaftar}"
            data-more="${safeMore}"
            class="w-full bg-gradient-to-r ${gradientClass} hover:opacity-95 text-white px-6 py-4 rounded-xl font-semibold shadow-md transition text-lg tracking-wide"
          >
            Daftar / Selengkapnya
          </button>
        `;
      }

      itemsHTML += `
        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 hover:scale-105 text-center border border-gray-100">
          <!-- Icon -->
          <div class="relative w-20 h-20 mx-auto mb-6">
            <div class="absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-30 rounded-full blur-lg"></div>
            <div class="relative w-20 h-20 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-3xl shadow-lg">
              <i class="${item.icon}"></i>
            </div>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-gray-800">${item.title}</h3>
          <p class="text-gray-600 mb-8 leading-relaxed">${item.description}</p>
          ${buttonHTML}
        </div>
      `;
    });

  pendaftaranContainer.innerHTML = itemsHTML;
}

// ===== Event delegation untuk toggle STFQ (klik 1x -> ganti jadi 2 tombol) =====
(function bindStfqToggle() {
  const container = document.getElementById('pendaftaran-items');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-stfq-toggle="true"]');
    if (!btn || !container.contains(btn)) return;

    const gradientClass = btn.dataset.gradient || "from-gray-400 to-gray-500";
    const linkDaftar = decodeURIComponent(btn.dataset.daftar || '#');
    const linkMore   = decodeURIComponent(btn.dataset.more || '#');

    btn.outerHTML = `
      <div class="flex flex-col gap-4">
        <a href="${linkDaftar}" target="_blank"
          class="block w-full text-center bg-gradient-to-r ${gradientClass} hover:opacity-95 text-white px-6 py-4 rounded-xl font-semibold shadow-md transition text-lg tracking-wide">
          Daftar Sekarang
        </a>
        <a href="${linkMore}" target="_blank"
          class="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold shadow-md transition text-lg tracking-wide">
          Selengkapnya
        </a>
      </div>
    `;
  });
})();

// ===== Set active tab (Mobile) =====
function setActiveTab(jenjang, colorKey) {
  const tabs = document.querySelectorAll("#pendaftaran-tabs button");
  tabs.forEach(tab => {
    tab.className = "px-5 py-2 rounded-full font-semibold transition text-sm bg-gray-200 text-gray-700";
  });

  const activeTab = document.getElementById(`tab-${jenjang}`);
  if (activeTab) {
    activeTab.className = `px-5 py-2 rounded-full font-semibold transition text-sm bg-gradient-to-r ${colorMap[colorKey]} text-white`;
  }

  renderPendaftaranItems(jenjang);
}

// ===== Init =====
renderTabs();
setActiveTab("SMP", "smp"); // default SMP
// renderPendaftaranItems("SMP"); // setActiveTab sudah memanggil renderPendaftaranItems

// Re-render saat resize (biar balik semua card di desktop)
window.addEventListener("resize", () => {
  if (window.innerWidth >= 640) {
    renderPendaftaranItems();
  } else {
    const active = document.querySelector("#pendaftaran-tabs button.bg-gradient-to-r");
    if (active) {
      const jenjang = active.innerText.trim();
      const colorKey = dataPendaftaran.pendaftaran.find(i => i.jenjang === jenjang)?.color;
      renderPendaftaranItems(jenjang);
      setActiveTab(jenjang, colorKey);
    }
  }
});
