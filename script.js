// Prime Time Buds site JS
// - Mobile nav toggle
// - Inventory rendering (view-only)
// - Search + category filtering
// - Product "View Details" modal
(() => {
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when clicking a link (mobile)
    siteNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -----------------------------
  // Inventory (placeholder data)
  // -----------------------------
  const inventory = [
    {
      id: 'ptb-001',
      name: 'Blueberry Kush',
      category: 'Flower',
      type: 'Indica',
      thc: '—',
      strain: 'Blueberry',
      notes: 'Placeholder description. Add effects, aroma, and any key notes.',
    },
    {
      id: 'ptb-002',
      name: 'Lemon Haze Gummies',
      category: 'Edibles',
      type: 'Edible',
      thc: '—',
      strain: 'Lemon',
      notes: 'Placeholder description. Add dosage info and flavor notes.',
    },
    {
      id: 'ptb-003',
      name: 'Hybrid Wax',
      category: 'Concentrates',
      type: 'Hybrid',
      thc: '—',
      strain: '—',
      notes: 'Placeholder description. Add texture, potency range, and usage notes.',
    },
    {
      id: 'ptb-004',
      name: 'OG Cartridge',
      category: 'Vape Carts',
      type: 'Indica',
      thc: '—',
      strain: 'OG',
      notes: 'Placeholder description. Add brand, size, and strain notes.',
    },
    {
      id: 'ptb-005',
      name: 'Classic Pre-Roll',
      category: 'Pre-Rolls',
      type: 'Hybrid',
      thc: '—',
      strain: '—',
      notes: 'Placeholder description. Add size and strain details.',
    },
    {
      id: 'ptb-006',
      name: 'Grinder (Metal)',
      category: 'Accessories',
      type: 'Accessory',
      thc: 'N/A',
      strain: 'N/A',
      notes: 'Placeholder description. Add materials, size, and features.',
    }
  ];

  const inventoryGrid = document.getElementById('inventoryGrid');
  const searchInput = document.getElementById('searchInput');
  const categorySelect = document.getElementById('categorySelect');

  // Modal
  const productModal = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalChips = document.getElementById('modalChips');
  const modalMeta = document.getElementById('modalMeta');

  function makeChip(text) {
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = text;
    return span;
  }

  function productCard(p) {
    const card = document.createElement('article');
    card.className = 'card product';
    card.setAttribute('data-category', p.category);

    const img = document.createElement('div');
    img.className = 'product__img';
    img.setAttribute('role', 'img');
    img.setAttribute('aria-label', 'Product image placeholder');

    const title = document.createElement('h4');
    title.className = 'product__title';
    title.textContent = p.name;

    const meta = document.createElement('div');
    meta.className = 'product__meta';
    meta.appendChild(makeChip(p.category));
    meta.appendChild(makeChip(p.type));
    if (p.thc) meta.appendChild(makeChip(`THC: ${p.thc}`));

    const actions = document.createElement('div');
    actions.className = 'product__actions';

    const btn = document.createElement('button');
    btn.className = 'btn btn--ghost';
    btn.type = 'button';
    btn.textContent = 'View Details';
    btn.addEventListener('click', () => openModal(p));

    actions.appendChild(btn);

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(actions);

    return card;
  }

  function openModal(p) {
    if (!productModal) return;

    modalTitle.textContent = p.name;
    modalDesc.textContent = p.notes || '—';

    // Chips
    modalChips.innerHTML = '';
    modalChips.appendChild(makeChip(p.category));
    modalChips.appendChild(makeChip(p.type));

    // Meta rows
    modalMeta.innerHTML = '';
    modalMeta.appendChild(metaRow('Category', p.category));
    modalMeta.appendChild(metaRow('Type', p.type));
    modalMeta.appendChild(metaRow('Strain / Flavor', p.strain || '—'));
    modalMeta.appendChild(metaRow('THC', p.thc || '—'));

    productModal.showModal();
  }

  function metaRow(label, value) {
    const row = document.createElement('div');
    row.className = 'meta-row';
    const left = document.createElement('span');
    left.textContent = label;
    const right = document.createElement('span');
    right.textContent = value;
    row.appendChild(left);
    row.appendChild(right);
    return row;
  }

  function closeModal() {
    if (productModal?.open) productModal.close();
  }

  modalClose?.addEventListener('click', closeModal);
  productModal?.addEventListener('click', (e) => {
    // Click outside the dialog content closes it
    const rect = productModal.getBoundingClientRect();
    const clickedInDialog =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;

    // For <dialog>, clicking backdrop registers as click on dialog itself,
    // but coordinates are outside content area.
    if (!clickedInDialog) closeModal();
  });

  // Filter/render
  function matchesQuery(p, q) {
    if (!q) return true;
    const hay = `${p.name} ${p.category} ${p.type} ${p.strain}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function matchesCategory(p, cat) {
    if (!cat || cat === 'all') return true;
    return p.category === cat;
  }

  function render() {
    if (!inventoryGrid) return;

    const q = (searchInput?.value || '').trim();
    const cat = categorySelect?.value || 'all';

    inventoryGrid.innerHTML = '';

    const filtered = inventory
      .filter(p => matchesQuery(p, q))
      .filter(p => matchesCategory(p, cat));

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'card';
      empty.innerHTML = `<strong>No matches.</strong><p class="muted">Try a different search or category.</p>`;
      inventoryGrid.appendChild(empty);
      return;
    }

    filtered.forEach(p => inventoryGrid.appendChild(productCard(p)));
  }

  searchInput?.addEventListener('input', render);
  categorySelect?.addEventListener('change', render);

  render();
})();
