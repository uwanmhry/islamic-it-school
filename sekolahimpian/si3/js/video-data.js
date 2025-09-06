const videoData = {
  categories: [
    { id: 'all', name: 'Semua' },
    { id: 'about', name: 'Tentang SI' },
    { id: 'quran', name: 'Bidang Al-Quran' },
    { id: 'technology', name: 'Bidang Teknologi' },
    { id: 'language', name: 'Bidang Bahasa' },
    { id: 'character', name: 'Bidang Karakter' }
  ],
  featuredVideos: [
    {
      title: "Tentang Gerakan Sekolah Impian Channel - Ep.1",
      iframe: "https://www.youtube.com/embed/ghWiI9MUQzI?si=",
      category: "about",
      allowFullScreen: true
    },
    {
      title: "Al-Quran 1",
      iframe: "https://www.youtube.com/embed/dIIs-HjaOpE?si=",
      category: "quran",
      allowFullScreen: true
    },
    {
      title: "Teknologi 1",
      iframe: "https://www.youtube.com/embed/OiyWnmnGSc8?si=",
      category: "technology",
      allowFullScreen: true
    },
    {
      title: "Bahasa 2",
      iframe: "https://www.youtube.com/embed/hxFtgSi_uNU?si=",
      category: "language",
      allowFullScreen: true
    },
    {
      title: "Karakter 1",
      iframe: "https://www.youtube.com/embed/CwMciPR8D0I?si=",
      category: "character",
      allowFullScreen: true
    }
  ],
  moreVideos: [
    // Tentang SI
    {
      title: "Tentang Gerakan Sekolah Impian Channel - Ep.1",
      iframe: "https://www.youtube.com/embed/ghWiI9MUQzI?si=",
      category: "about",
      allowFullScreen: true
    },
    {
      title: "BUAT APA SIH SEKOLAH ?? - Tentang GSI Ep.2",
      iframe: "https://www.youtube.com/embed/ouUtvQL_C4E?si=",
      category: "about",
      allowFullScreen: true
    },
    {
      title: "Prototype Generasi Impian ! - Tentang GSI Ep. 5",
      iframe: "https://www.youtube.com/embed/3lFEJ3Umt_c?si=",
      category: "about",
      allowFullScreen: true
    },
    {
      title: "Rumus Sukses Sekolah Impian - Tentang GSI Ep. 6",
      iframe: "https://www.youtube.com/embed/VKL_JObbL6s?si=",
      category: "about",
      allowFullScreen: true
    },
    {
      title: "Tujuan Pendidikan Sekolah Impian - Tentang GSI Ep. 9",
      iframe: "https://www.youtube.com/embed/9gVgDPcC9ls?si=",
      category: "about",
      allowFullScreen: true
    },

    // Al-Quran
    {
      title: "Kenapa Kita Harus Mempelajari Al-Quran ?? - Tentang GSI Ep.3",
      iframe: "https://www.youtube.com/embed/dIIs-HjaOpE?si=",
      category: "quran",
      allowFullScreen: true
    },
    {
      title: "Integrasi Antara Al-Quran, Teknologi dan Bahasa - Tentang GSI Ep. 10",
      iframe: "https://www.youtube.com/embed/ZhpaG2cM6CA?si=",
      category: "quran",
      allowFullScreen: true
    },
    {
      title: "Idealnya Visi Misi Hidup Muslim Adalah Al-Quran !",
      iframe: "https://www.youtube.com/embed/hOMAXATrA3w?si=",
      category: "quran",
      allowFullScreen: true
    },
    {
      title: "Butuh Cinta Untuk Menghafal, dan Butuh Setia Untuk Menjaga Hafalan | Kenal Team GSI Ep. 3",
      iframe: "https://www.youtube.com/embed/bO8kI-Dxnao?si=",
      category: "quran",
      allowFullScreen: true
    },
    {
      title: "Yuk Cetak Anak Kita Menjadi Bisnisman yang Hafal Quran - Islamic Parenthink Ep. 6",
      iframe: "https://www.youtube.com/embed/iwIhuTY662U?si=",
      category: "quran",
      allowFullScreen: true
    },

    // Teknologi
    {
      title: "Teknologi 1",
      iframe: "https://www.youtube.com/embed/OiyWnmnGSc8?si=",
      category: "technology",
      allowFullScreen: true
    },
    {
      title: "Teknologi 2 (ZhpaG2cM6CA)",
      iframe: "https://www.youtube.com/embed/ZhpaG2cM6CA?si=",
      category: "technology",
      allowFullScreen: true
    },
    {
      title: "Teknologi 3",
      iframe: "https://www.youtube.com/embed/Mo2wwBBq9EE?si=",
      category: "technology",
      allowFullScreen: true
    },
    {
      title: "Teknologi 4",
      iframe: "https://www.youtube.com/embed/nLClvIAKyhk?si=",
      category: "technology",
      allowFullScreen: true
    },
    {
      title: "Teknologi 5",
      iframe: "https://www.youtube.com/embed/5ATUPIjtj0w?si=",
      category: "technology",
      allowFullScreen: true
    },

    // Bahasa
    {
      title: "Bahasa 1 (ZhpaG2cM6CA)",
      iframe: "https://www.youtube.com/embed/ZhpaG2cM6CA?si=",
      category: "language",
      allowFullScreen: true
    },
    {
      title: "Bahasa 2",
      iframe: "https://www.youtube.com/embed/hxFtgSi_uNU?si=",
      category: "language",
      allowFullScreen: true
    },
    {
      title: "Bahasa 3",
      iframe: "https://www.youtube.com/embed/BIu8eUS0wag?si=",
      category: "language",
      allowFullScreen: true
    },
    {
      title: "Bahasa 4",
      iframe: "https://www.youtube.com/embed/y35m2x3jEf8?si=",
      category: "language",
      allowFullScreen: true
    },

    // Karakter
    {
      title: "Karakter 1",
      iframe: "https://www.youtube.com/embed/CwMciPR8D0I?si=",
      category: "character",
      allowFullScreen: true
    },
    {
      title: "Karakter 2",
      iframe: "https://www.youtube.com/embed/dg9TtNQsST0?si=",
      category: "character",
      allowFullScreen: true
    },
    {
      title: "Karakter 3 (duplicate dg9TtNQsST0)",
      iframe: "https://www.youtube.com/embed/dg9TtNQsST0?si=",
      category: "character",
      allowFullScreen: true
    },
    {
      title: "Karakter 4",
      iframe: "https://www.youtube.com/embed/B6FS4WGmZNI?si=",
      category: "character",
      allowFullScreen: true
    },
    {
      title: "Karakter 5",
      iframe: "https://www.youtube.com/embed/a-1OCi7uufI?si=",
      category: "character",
      allowFullScreen: true
    },
    {
      title: "Karakter 6",
      iframe: "https://www.youtube.com/embed/FHUjKohIMUA?si=",
      category: "character",
      allowFullScreen: true
    }
  ]
};
