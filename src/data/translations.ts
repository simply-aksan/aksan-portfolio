export type Locale = 'en' | 'id';

export interface TranslationSchema {
  common: {
    vol: string;
    origin: string;
    institution: string;
    locationBadge: string;
    verifiedRecord: string;
    close: string;
    cancel: string;
    save: string;
    loading: string;
  };
  nav: {
    chapters: {
      prologue: { title: string; subtitle: string };
      works: { title: string; subtitle: string };
      capabilities: { title: string; subtitle: string };
      journey: { title: string; subtitle: string };
      contact: { title: string; subtitle: string };
    };
    drawer: {
      badge: string;
      titlePrefix: string;
      titleItalic: string;
      currentBadge: string;
      escDismiss: string;
      monographIndex: string;
    };
    audioTooltipOn: string;
    audioTooltipOff: string;
    cmsLabel: string;
  };
  transitions: {
    t0102: {
      fromTitle: string;
      toTitle: string;
      indicator: string;
    };
    t0203: {
      fromTitle: string;
      toTitle: string;
      indicator: string;
    };
    t0304: {
      fromTitle: string;
      toTitle: string;
      indicator: string;
    };
    t0405: {
      fromTitle: string;
      toTitle: string;
      indicator: string;
    };
  };
  hero: {
    badge: string;
    headlinePrefix: string;
    headlineItalic: string;
    headlineSuffix: string;
    bioHeader: string;
    bioText: string;
    exploreWorkBtn: string;
    initiateConversationBtn: string;
    openBtn: string;
    marquee: string[];
  };
  works: {
    badge: string;
    headingPrefix: string;
    headingItalic: string;
    subtitle: string;
    filters: {
      all: string;
      softwareDev: string;
      experimentalWeb: string;
      aiArchitecture: string;
    };
    inspectDossier: string;
    scrubHelper: string;
    emptyNotice: string;
    modal: {
      header: string;
      year: string;
      category: string;
      role: string;
      status: string;
      liveSite: string;
      repo: string;
      overview: string;
      challenge: string;
      solution: string;
      impact: string;
      technologies: string;
      close: string;
    };
  };
  capabilities: {
    badge: string;
    headingPrefix: string;
    headingItalic: string;
    subtitle: string;
    toggleShelf: string;
    toggleMatrix: string;
    shelfModes: {
      master: string;
      skills: string;
      credentials: string;
    };
    instructions: string;
    modal: {
      header: string;
      issuedBy: string;
      issueDate: string;
      credentialId: string;
      syllabus: string;
      verifyBtn: string;
      connectedSkills: string;
      close: string;
    };
  };
  journey: {
    badge: string;
    headingPrefix: string;
    headingItalic: string;
    subtitle: string;
    cvButton: string;
    status: string;
    filters: {
      all: string;
      education: string;
      experience: string;
      development: string;
    };
    checkpointLabel: string;
    focusPointsTitle: string;
    cvModal: {
      title: string;
      subtitle: string;
      summaryHeading: string;
      summaryText: string;
      educationHeading: string;
      experienceHeading: string;
      technicalSkillsHeading: string;
      downloadPdf: string;
      close: string;
    };
  };
  contact: {
    badge: string;
    headingPrefix: string;
    headingName: string;
    note: string;
    emailTransmission: string;
    copy: string;
    copied: string;
    socialChannels: string;
    inquiryTerminal: string;
    directDispatch: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    domainLabel: string;
    domainOptions: {
      software: string;
      web: string;
      general: string;
    };
    scopeLabel: string;
    scopePlaceholder: string;
    submitBtn: string;
    successTitle: string;
    successDesc: string;
    openMailClient: string;
    copyBrief: string;
    sendAnother: string;
    colophon: string;
  };
}

export const TRANSLATIONS: Record<Locale, TranslationSchema> = {
  en: {
    common: {
      vol: 'VOL. 2026 // ID',
      origin: 'Semarang, Central Java',
      institution: 'Politeknik IDN Bogor',
      locationBadge: 'Semarang → Bogor',
      verifiedRecord: 'Verified Record',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save Changes',
      loading: 'Loading Data...',
    },
    nav: {
      chapters: {
        prologue: { title: 'PROLOGUE', subtitle: 'Curator Bio & Mission' },
        works: { title: 'SELECTED WORKS', subtitle: '3D Frieze Exhibition Reel' },
        capabilities: { title: 'CAPABILITIES', subtitle: 'Monograph Shelf & Atlas' },
        journey: { title: 'JOURNEY', subtitle: 'Expedition Route & Milestones' },
        contact: { title: 'CONTACT', subtitle: 'Collaboration Terminal' },
      },
      drawer: {
        badge: 'AKSANLAB MONOGRAPH ARCHIVES',
        titlePrefix: 'Table of Chapters &',
        titleItalic: 'Expeditions',
        currentBadge: 'Active Chapter',
        escDismiss: 'TO DISMISS',
        monographIndex: 'CH. 01 — 05 · MONOGRAPH INDEX',
      },
      audioTooltipOn: 'Acoustic Sound: Active',
      audioTooltipOff: 'Enable Acoustic Sound',
      cmsLabel: 'CMS',
    },
    transitions: {
      t0102: {
        fromTitle: 'PROLOGUE',
        toTitle: 'SELECTED WORKS',
        indicator: 'TRANSITION TO 3D EXHIBITION REEL',
      },
      t0203: {
        fromTitle: 'SELECTED WORKS',
        toTitle: 'CAPABILITIES & ARCHIVE',
        indicator: 'ACCESSING 3D MONOGRAPH SHELF',
      },
      t0304: {
        fromTitle: 'CAPABILITIES',
        toTitle: 'EXPEDITION ROUTE',
        indicator: 'CALIBRATING OVERWORLD ODYSSEY',
      },
      t0405: {
        fromTitle: 'EXPEDITION ROUTE',
        toTitle: 'COLLABORATION TERMINAL',
        indicator: 'ESTABLISHING DIRECT TRANSMISSION CHANNEL',
      },
    },
    hero: {
      badge: 'AKSAN ZULKARNAIN',
      headlinePrefix: 'Building digital experiences with',
      headlineItalic: 'curiosity',
      headlineSuffix: 'and purpose.',
      bioHeader: 'Profile & Curator Bio',
      bioText:
        'First-semester Software Engineering (TRPL) student at Politeknik IDN Bogor, originally from Semarang. Dedicated to deconstructing and strengthening programming fundamentals, then advancing them into modern, resilient digital systems.',
      exploreWorkBtn: 'Explore Selected Work',
      initiateConversationBtn: 'Initiate Conversation',
      openBtn: 'Explore',
      marquee: [
        'AKSAN ZULKARNAIN',
        'SOFTWARE DEVELOPER',
        'EXPERIMENTAL WEB SYSTEMS',
        'AI-NATIVE ARCHITECTURE',
        'POLITEKNIK IDN BOGOR',
      ],
    },
    works: {
      badge: '02. SELECTED WORKS',
      headingPrefix: 'Frieze 3D Cover-Flow',
      headingItalic: 'exhibition reel',
      subtitle:
        'A curated archive of production platforms, spatial interfaces, and software architectures. Drag to scrub or click any card for full monograph dossier.',
      filters: {
        all: 'All Dispatches',
        softwareDev: 'Software Development',
        experimentalWeb: 'Experimental Web Systems',
        aiArchitecture: 'AI-Native Architecture',
      },
      inspectDossier: 'Inspect Monograph Dossier',
      scrubHelper: 'DRAG OR SCROLL HORIZONTALLY TO SCRUB FRIEZE REEL',
      emptyNotice: 'No projects found in this category slot.',
      modal: {
        header: 'ARCHITECTURAL MONOGRAPH DOSSIER',
        year: 'Year',
        category: 'Discipline',
        role: 'Role',
        status: 'Status',
        liveSite: 'Launch Live Site',
        repo: 'Source Repository',
        overview: '01 // OVERVIEW & CONTEXT',
        challenge: '02 // THE ENGINEERING CHALLENGE',
        solution: '03 // ARCHITECTURAL SOLUTION',
        impact: '04 // QUANTIFIABLE IMPACT',
        technologies: 'Technologies & Runtime Spec',
        close: 'Close Dossier',
      },
    },
    capabilities: {
      badge: '03. CAPABILITIES & ARCHIVE',
      headingPrefix: 'Monograph shelf &',
      headingItalic: 'relational atlas',
      subtitle:
        'Deconstructing technical disciplines across full-stack engineering, reactive PHP components, and verifiable professional accreditations.',
      toggleShelf: '3D Monograph Shelf',
      toggleMatrix: 'Relational Atlas Matrix',
      shelfModes: {
        master: 'Tomes Overview',
        skills: 'Technical Skills (10)',
        credentials: 'Verified Credentials (5)',
      },
      instructions: 'Click any volume to inspect detailed syllabus & verification accreditation.',
      modal: {
        header: 'VERIFIED CREDENTIAL ARCHIVE',
        issuedBy: 'Issuing Authority',
        issueDate: 'Conferred Date',
        credentialId: 'Accreditation ID',
        syllabus: 'Comprehensive Scope & Demonstrated Rigor',
        verifyBtn: 'Verify Official Accreditation',
        connectedSkills: 'Connected Technical Disciplines',
        close: 'Close Certificate',
      },
    },
    journey: {
      badge: '04. JOURNEY & ROUTE',
      headingPrefix: 'Adventure overworld map &',
      headingItalic: 'expedition route',
      subtitle:
        'Explore the landmark checkpoints of the developer odyssey: from fundamental software engineering basecamp at IDN Bogor to warehouse logistics operations at Astra Semarang.',
      cvButton: 'Inspect Official CV Dossier',
      status: 'STATUS: 2/2 NODES UNLOCKED · GPS ACTIVE',
      filters: {
        all: 'All Landmarks',
        education: 'Education',
        experience: 'Experience',
        development: 'Development',
      },
      checkpointLabel: 'CHECKPOINT',
      focusPointsTitle: 'Key Engineering Focus & Responsibilities',
      cvModal: {
        title: 'CURRICULUM VITAE // DOSSIER',
        subtitle: 'Aksan Zulkarnain · Software Engineering & Web Systems',
        summaryHeading: 'Professional Overview',
        summaryText:
          'Software Engineering (TRPL) undergraduate at Politeknik IDN Bogor. Focused on core programming fundamentals, clean code principles, and modern web application development using PHP, Laravel, Livewire, React, MySQL, and Supabase.',
        educationHeading: 'Academic History',
        experienceHeading: 'Work Experience',
        technicalSkillsHeading: 'Technical Repertoire',
        downloadPdf: 'Download Official CV',
        close: 'Close CV Dossier',
      },
    },
    contact: {
      badge: '05. CONTACT & COLLABORATION',
      headingPrefix: 'Start a conversation with',
      headingName: 'Aksan Zulkarnain',
      note: 'Open to software engineering roles, web development projects, and experimental digital system collaborations.',
      emailTransmission: 'DIRECT EMAIL TRANSMISSION',
      copy: 'Copy',
      copied: 'Copied',
      socialChannels: 'Verified Social Channels & Network',
      inquiryTerminal: 'INQUIRY COMPOSITION TERMINAL',
      directDispatch: 'Direct Dispatch',
      nameLabel: 'YOUR NAME *',
      namePlaceholder: 'e.g. Maya Lin',
      emailLabel: 'EMAIL ADDRESS *',
      emailPlaceholder: 'maya@example.com',
      domainLabel: 'INQUIRY DOMAIN',
      domainOptions: {
        software: 'Software Development & Engineering',
        web: 'Web Systems & Full-Stack Applications',
        general: 'General Conversation & Mentorship',
      },
      scopeLabel: 'COLLABORATION SCOPE & OBJECTIVES *',
      scopePlaceholder: 'Describe the problem, timeline, or product vision...',
      submitBtn: 'Dispatch Collaboration Inquiry',
      successTitle: 'Transmission Prepared',
      successDesc: 'Your collaboration brief has been validated and compiled into an email transmission dispatch.',
      openMailClient: 'Open Mail Client',
      copyBrief: 'Copy Transmission Brief',
      sendAnother: 'Send Another Inquiry',
      colophon: 'Bogor / Semarang, Indonesia (WIB UTC+7) · Engineered with React 19, TypeScript, Three.js & Supabase.',
    },
  },
  id: {
    common: {
      vol: 'EDISI 2026 // ID',
      origin: 'Semarang, Jawa Tengah',
      institution: 'Politeknik IDN Bogor',
      locationBadge: 'Semarang → Bogor',
      verifiedRecord: 'Sertifikat Terverifikasi',
      close: 'Tutup',
      cancel: 'Batal',
      save: 'Simpan Perubahan',
      loading: 'Memuat Data...',
    },
    nav: {
      chapters: {
        prologue: { title: 'PROLOG', subtitle: 'Bio Kurator & Misi' },
        works: { title: 'KARYA PILIHAN', subtitle: 'Ekshibisi Reel 3D Frieze' },
        capabilities: { title: 'KEMAMPUAN', subtitle: 'Rak Monograf & Atlas' },
        journey: { title: 'PERJALANAN', subtitle: 'Rute Ekspedisi & Tonggak' },
        contact: { title: 'KONTAK', subtitle: 'Terminal Kolaborasi' },
      },
      drawer: {
        badge: 'ARSIP MONOGRAF AKSANLAB',
        titlePrefix: 'Daftar Bab &',
        titleItalic: 'Ekspedisi',
        currentBadge: 'Bab Aktif',
        escDismiss: 'UNTUK MENUTUP',
        monographIndex: 'BAB 01 — 05 · INDEKS MONOGRAF',
      },
      audioTooltipOn: 'Suara Akustik: Aktif',
      audioTooltipOff: 'Aktifkan Suara Akustik',
      cmsLabel: 'CMS',
    },
    transitions: {
      t0102: {
        fromTitle: 'PROLOG',
        toTitle: 'KARYA PILIHAN',
        indicator: 'MENUJU EKSIBI REEL 3D KARYA PILIHAN',
      },
      t0203: {
        fromTitle: 'KARYA PILIHAN',
        toTitle: 'KEMAMPUAN & ARSIP',
        indicator: 'MEMBUKA RAK MONOGRAF & KEMAMPUAN',
      },
      t0304: {
        fromTitle: 'KEMAMPUAN',
        toTitle: 'RUTE EKSPEDISI',
        indicator: 'MEMETAKAN LINTASAN PERJALANAN',
      },
      t0405: {
        fromTitle: 'RUTE EKSPEDISI',
        toTitle: 'TERMINAL KOLABORASI',
        indicator: 'MEMBUKA SALURAN TRANSMISI KOMUNIKASI',
      },
    },
    hero: {
      badge: 'AKSAN ZULKARNAIN',
      headlinePrefix: 'Membangun pengalaman digital dengan',
      headlineItalic: 'rasa ingin tahu',
      headlineSuffix: 'dan tujuan bermakna.',
      bioHeader: 'Profil & Bio Kurator',
      bioText:
        'Mahasiswa semester 1 Rekayasa Perangkat Lunak (TRPL) di Politeknik IDN Bogor, asal Semarang. Berfokus mendalami kembali fundamental pemrograman secara mendalam dan mengembangkannya menjadi sistem web modern yang teruji.',
      exploreWorkBtn: 'Jelajahi Karya Pilihan',
      initiateConversationBtn: 'Mulai Percakapan',
      openBtn: 'Buka',
      marquee: [
        'AKSAN ZULKARNAIN',
        'REKAYASA PERANGKAT LUNAK',
        'SISTEM WEB EKSPERIMENTAL',
        'ARSITEKTUR BERBASIS AI',
        'POLITEKNIK IDN BOGOR',
      ],
    },
    works: {
      badge: '02. KARYA PILIHAN',
      headingPrefix: 'Ekshibisi 3D Cover-Flow',
      headingItalic: 'karya pilihan',
      subtitle:
        'Arsip terkurasi platform produksi, antarmuka spasial, dan arsitektur perangkat lunak. Geser untuk menjelajah atau klik kartu untuk membaca berkas monograf lengkap.',
      filters: {
        all: 'Semua Karya',
        softwareDev: 'Rekayasa Perangkat Lunak',
        experimentalWeb: 'Sistem Web Eksperimental',
        aiArchitecture: 'Arsitektur Berbasis AI',
      },
      inspectDossier: 'Buka Berkas Monograf',
      scrubHelper: 'GESER ATAU GULIR HORIZONTAL UNTUK MENJELAJAHI REEL',
      emptyNotice: 'Belum ada proyek dalam kategori ini.',
      modal: {
        header: 'BERKAS MONOGRAF ARSITEKTUR',
        year: 'Tahun',
        category: 'Disiplin',
        role: 'Peran',
        status: 'Status',
        liveSite: 'Kunjungi Situs Live',
        repo: 'Repositori Kode',
        overview: '01 // GAMBARAN UMUM & KONTEKS',
        challenge: '02 // TANTANGAN REKAYASA',
        solution: '03 // SOLUSI ARSITEKTUR',
        impact: '04 // DAMPAK TERUKUR',
        technologies: 'Teknologi & Spesifikasi Runtime',
        close: 'Tutup Berkas',
      },
    },
    capabilities: {
      badge: '03. KEMAMPUAN & ARSIP',
      headingPrefix: 'Rak monograf &',
      headingItalic: 'atlas relasional',
      subtitle:
        'Membedah disiplin teknis mulai dari rekayasa full-stack, komponen reaktif PHP, hingga akreditasi profesional yang terverifikasi.',
      toggleShelf: 'Rak Monograf 3D',
      toggleMatrix: 'Matriks Atlas Relasional',
      shelfModes: {
        master: 'Ringkasan Tome',
        skills: 'Keahlian Teknis (10)',
        credentials: 'Sertifikat Terverifikasi (5)',
      },
      instructions: 'Klik buku apa pun untuk melihat silabus mendalam & verifikasi akreditasi.',
      modal: {
        header: 'ARSIP SERTIFIKASI TERVERIFIKASI',
        issuedBy: 'Lembaga Penerbit',
        issueDate: 'Tahun Penerbitan',
        credentialId: 'ID Akreditasi',
        syllabus: 'Cakupan Kurikulum & Kompetensi yang Diuji',
        verifyBtn: 'Verifikasi Akreditasi Resmi',
        connectedSkills: 'Disiplin Teknis Terhubung',
        close: 'Tutup Sertifikat',
      },
    },
    journey: {
      badge: '04. PERJALANAN & RUTE',
      headingPrefix: 'Peta ekspedisi &',
      headingItalic: 'lintasan perjalanan',
      subtitle:
        'Jelajahi tonggak perjalanan rekayasa perangkat lunak: dari penempaan fundamental di Politeknik IDN Bogor hingga operasional logistik inventaris pergudangan di Astra Semarang.',
      cvButton: 'Buka Berkas CV Resmi',
      status: 'STATUS: 2/2 TONGGAK TERBUKA · GPS AKTIF',
      filters: {
        all: 'Semua Tonggak',
        education: 'Pendidikan',
        experience: 'Pengalaman',
        development: 'Pengembangan',
      },
      checkpointLabel: 'TITIK TONGGAK',
      focusPointsTitle: 'Fokus & Tanggung Jawab Utama',
      cvModal: {
        title: 'DAFTAR RIWAYAT HIDUP // RESUME',
        subtitle: 'Aksan Zulkarnain · Rekayasa Perangkat Lunak & Sistem Web',
        summaryHeading: 'Ringkasan Profesional',
        summaryText:
          'Mahasiswa Sarjana Terapan Teknologi Rekayasa Perangkat Lunak (TRPL) di Politeknik IDN Bogor. Berfokus pada penguatan fundamental pemrograman, metodologi clean code, serta pengembangan web modern menggunakan PHP, Laravel, Livewire, React, MySQL, dan Supabase.',
        educationHeading: 'Riwayat Pendidikan',
        experienceHeading: 'Pengalaman Kerja',
        technicalSkillsHeading: 'Keahlian Teknis',
        downloadPdf: 'Unduh Dokumen CV',
        close: 'Tutup Berkas CV',
      },
    },
    contact: {
      badge: '05. KONTAK & KOLABORASI',
      headingPrefix: 'Mulai percakapan dengan',
      headingName: 'Aksan Zulkarnain',
      note: 'Terbuka untuk peluang rekayasa perangkat lunak, proyek pengembangan web, serta kolaborasi sistem digital inovatif.',
      emailTransmission: 'TRANSMISI EMAIL LANGSUNG',
      copy: 'Salin',
      copied: 'Tersalin',
      socialChannels: 'Saluran Sosial & Jaringan Resmi',
      inquiryTerminal: 'TERMINAL KOMPOSISI PESAN',
      directDispatch: 'Pengiriman Langsung',
      nameLabel: 'NAMA LENGKAP *',
      namePlaceholder: 'Contoh: Budi Santoso',
      emailLabel: 'ALAMAT EMAIL *',
      emailPlaceholder: 'nama@perusahaan.com',
      domainLabel: 'BIDANG PERTANYAAN / PROYEK',
      domainOptions: {
        software: 'Pengembangan & Rekayasa Perangkat Lunak',
        web: 'Sistem Web & Aplikasi Full-Stack',
        general: 'Percakapan Umum & Kolaborasi',
      },
      scopeLabel: 'RUANG LINGKUP & TUJUAN KOLABORASI *',
      scopePlaceholder: 'Jelaskan kebutuhan proyek, target waktu, atau visi produk...',
      submitBtn: 'Kirimkan Pesan Kolaborasi',
      successTitle: 'Draf Transmisi Telah Siap',
      successDesc: 'Draf kolaborasi Anda telah divalidasi dan disusun menjadi format transmisi email resmi.',
      openMailClient: 'Buka Aplikasi Email',
      copyBrief: 'Salin Draf Pesan',
      sendAnother: 'Kirim Pesan Lainnya',
      colophon: 'Bogor / Semarang, Indonesia (WIB UTC+7) · Dibangun dengan React 19, TypeScript, Three.js & Supabase.',
    },
  },
};

