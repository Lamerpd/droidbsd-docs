// droidBSD Documentation - Client Script

document.addEventListener('DOMContentLoaded', () => {
  // Theme
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('droidbsd-theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('droidbsd-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  // Mobile menu
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  menuToggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
  });

  // Close sidebar on nav click (mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      sidebar?.classList.remove('open');
    });
  });

  // Section navigation
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  function showSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));

    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      const activeLink = document.querySelector(`.nav-link[data-section="${id}"]`);
      activeLink?.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      if (section) showSection(section);
    });
  });

  // Initial section from hash
  const hash = window.location.hash.slice(1) || 'home';
  showSection(hash);

  window.addEventListener('hashchange', () => {
    const id = window.location.hash.slice(1) || 'home';
    showSection(id);
  });

  // Expandables
  document.querySelectorAll('.expandable-header').forEach(header => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('open');
    });
  });

  // Search
  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  const searchableContent = [
    { id: 'home', title: 'Home', keywords: 'droidbsd overview introduction berry mascot' },
    { id: 'what-is', title: 'What is droidBSD?', keywords: 'bsd mobile operating system experimental android' },
    { id: 'goals', title: 'Project Goals', keywords: 'goals objectives bare-metal userspace' },
    { id: 'architecture', title: 'Architecture', keywords: 'architecture layers linux kernel bridge' },
    { id: 'how-it-works', title: 'How It Works', keywords: 'workflow process detect adapt test' },
    { id: 'linux-kernel', title: 'Linux Kernel Layer', keywords: 'linux kernel drivers hardware support' },
    { id: 'libdt', title: 'libdt', keywords: 'libdt device tree adaptation patching' },
    { id: 'device-tree', title: 'Device Tree & Hardware Detection', keywords: 'device tree dtb hardware detection' },
    { id: 'gpu', title: 'GPU / Compatibility Layer', keywords: 'gpu proprietary blobs hybris compatibility' },
    { id: 'userspace', title: 'BSD Userspace', keywords: 'bsd userspace shell utilities services' },
    { id: 'boot', title: 'Boot Process', keywords: 'boot init zygote transition userspace' },
    { id: 'gui', title: 'Graphical Interface', keywords: 'gui graphical interface mobile ui' },
    { id: 'compatibility', title: 'Device Compatibility', keywords: 'compatibility obstacles soc gpu firmware' },
    { id: 'supported', title: 'Supported Devices', keywords: 'supported devices list experimental' },
    { id: 'installation', title: 'Installation', keywords: 'installation flashing permanent' },
    { id: 'testing', title: 'Testing Before Flashing', keywords: 'testing temporary boot safety' },
    { id: 'development', title: 'Development', keywords: 'development building contributing' },
    { id: 'contributing', title: 'Contributing', keywords: 'contributing community help devices' },
    { id: 'building', title: 'Building System Images', keywords: 'building images source compile' },
    { id: 'troubleshooting', title: 'Troubleshooting', keywords: 'troubleshooting problems issues' },
    { id: 'faq', title: 'FAQ', keywords: 'faq questions answers android bsd' },
    { id: 'roadmap', title: 'Roadmap', keywords: 'roadmap future plans milestones' },
    { id: 'safety', title: 'Safety / Warnings', keywords: 'safety warnings brick risk backup' },
    { id: 'mascot', title: 'Project Mascot / Berry', keywords: 'mascot berry mouse cheese' },
  ];

  searchToggle?.addEventListener('click', () => {
    searchOverlay?.classList.add('active');
    searchInput?.focus();
  });

  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchOverlay?.classList.add('active');
      searchInput?.focus();
    }
    if (e.key === 'Escape') {
      searchOverlay?.classList.remove('active');
    }
  });

  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) {
      searchResults.innerHTML = '';
      return;
    }
    const matches = searchableContent.filter(item => 
      item.title.toLowerCase().includes(q) || item.keywords.includes(q)
    );
    searchResults.innerHTML = matches.length 
      ? matches.map(m => `<a href="#${m.id}" class="search-result-item" data-section="${m.id}">${m.title}</a>`).join('')
      : '<div class="search-result-item" style="color:var(--text-muted)">No results found</div>';

    searchResults.querySelectorAll('.search-result-item[data-section]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(el.getAttribute('data-section'));
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
      });
    });
  });
});