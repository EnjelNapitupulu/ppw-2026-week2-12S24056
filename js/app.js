/**
 * app.js
 * ------------------------------------------------------------------
 * Presentation Layer (Client / Browser Tier).
 * Bertanggung jawab atas: manipulasi DOM, render dinamis, state UI
 * (loading / success / empty / error), modal universal, pengiriman
 * form asinkron, dan persistensi riwayat pesanan di localStorage.
 * ------------------------------------------------------------------
 */

const App = {

  state: {
    projects: [],
    services: [],
    activeCategory: 'all'
  },

  async init() {
    this.cacheDom();
    this.bindEvents();
    await this.loadProfile();
    await this.loadProjects();
    await this.loadServices();
    this.renderOrderBadge();
  },

  cacheDom() {
    this.el = {
      profileName: document.getElementById('profileName'),
      profileRole: document.getElementById('profileRole'),
      profileBio: document.getElementById('profileBio'),
      profileAvatar: document.getElementById('profileAvatar'),
      skillsList: document.getElementById('skillsList'),
      workflowList: document.getElementById('workflowList'),
      statProjects: document.getElementById('statProjects'),
      statGpa: document.getElementById('statGpa'),
      statAccessible: document.getElementById('statAccessible'),

      filterButtons: document.querySelectorAll('[data-filter]'),
      projectsContainer: document.getElementById('projectsContainer'),

      servicesContainer: document.getElementById('servicesContainer'),

      modalTitle: document.getElementById('projectModalTitle'),
      modalBody: document.getElementById('projectModalBody'),

      contactForm: document.getElementById('contactForm'),
      submitBtn: document.getElementById('submitBtn'),
      orderBadge: document.getElementById('orderBadge'),

      toastEl: document.getElementById('appToast'),
      toastTitle: document.getElementById('toastTitle'),
      toastMessage: document.getElementById('toastMessage')
    };
  },

  bindEvents() {
    this.el.filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.state.activeCategory = btn.dataset.filter;
        this.el.filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderProjects();
      });
    });

    this.el.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
  },

  /* ------------------------------------------------------------
     SANITASI — mencegah DOM-based XSS saat merender nilai dinamis
     ------------------------------------------------------------ */
  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = String(str ?? '');
    return div.innerHTML;
  },

  /* ------------------------------------------------------------
     PROFILE
     ------------------------------------------------------------ */
  async loadProfile() {
    try {
      const profile = await ApiService.fetchProfile();
      this.el.profileName.textContent = profile.name;
      this.el.profileRole.textContent = profile.role;
      this.el.profileBio.textContent = profile.bio;
      this.el.profileAvatar.src = profile.avatar;
      this.el.profileAvatar.alt = `Foto profil ${profile.name}`;

      this.el.skillsList.innerHTML = profile.skills
        .map((s) => `<li class="list-inline-item"><span class="badge skill-badge">${this.escapeHTML(s)}</span></li>`)
        .join('');

      this.el.workflowList.innerHTML = profile.workflow
        .map((w) => `<li>${this.escapeHTML(w)}</li>`)
        .join('');

      this.el.statProjects.textContent = profile.stats.projects;
      this.el.statGpa.textContent = profile.stats.gpa;
      this.el.statAccessible.textContent = profile.stats.accessible;
    } catch (err) {
      console.error('Gagal memuat profil:', err);
    }
  },

  /* ------------------------------------------------------------
     PROJECTS — Loading / Success / Empty / Error states
     ------------------------------------------------------------ */
  async loadProjects() {
    this.renderLoadingState(this.el.projectsContainer, 3);
    try {
      this.state.projects = await ApiService.fetchProjects();
      this.renderProjects();
    } catch (err) {
      this.renderErrorState(
        this.el.projectsContainer,
        'Gagal memuat data proyek. Periksa koneksi internet Anda dan coba lagi.'
      );
    }
  },

  renderProjects() {
    const { projects, activeCategory } = this.state;
    const filtered = activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

    if (filtered.length === 0) {
      this.renderEmptyState(
        this.el.projectsContainer,
        'Belum ada proyek pada kategori ini.'
      );
      return;
    }

    this.el.projectsContainer.innerHTML = filtered.map((proj) => `
      <div class="col">
        <article class="card project-card h-100 shadow-sm border-0">
          <img src="${proj.thumbnail}" class="card-img-top project-thumb" alt="${this.escapeHTML(proj.title)}" loading="lazy">
          <div class="card-body">
            <span class="badge tech-badge mb-2">${this.escapeHTML(proj.tags[0] ?? proj.category)}</span>
            <h3 class="h6 fw-bold">${this.escapeHTML(proj.title)}</h3>
            <p class="small text-muted">${this.escapeHTML(proj.description).slice(0, 90)}...</p>
            <button type="button" class="btn btn-sm btn-outline-brand mt-2" data-project-id="${proj.id}">
              Lihat Detail <i class="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </article>
      </div>
    `).join('');

    // Pasang event listener ke tombol-tombol yang baru dirender
    this.el.projectsContainer.querySelectorAll('[data-project-id]').forEach((btn) => {
      btn.addEventListener('click', () => this.openProjectModal(btn.dataset.projectId));
    });
  },

  /* ------------------------------------------------------------
     UNIVERSAL DYNAMIC MODAL — satu modal untuk semua proyek
     ------------------------------------------------------------ */
  openProjectModal(projectId) {
    const proj = this.state.projects.find((p) => p.id === projectId);
    if (!proj) return;

    this.el.modalTitle.textContent = proj.title;

    // Pakai escapeHTML pada setiap nilai dinamis sebelum disisipkan
    // ke innerHTML, supaya aman dari serangan DOM-based XSS.
    this.el.modalBody.innerHTML = `
      <img src="${proj.thumbnail}" class="img-fluid rounded mb-3 w-100" alt="${this.escapeHTML(proj.title)}">
      <p class="text-secondary">${this.escapeHTML(proj.description)}</p>
      <div class="d-flex flex-wrap gap-2 mb-3">
        ${proj.tags.map((t) => `<span class="badge tech-badge">${this.escapeHTML(t)}</span>`).join('')}
      </div>
      <ul class="list-unstyled small text-muted mb-0">
        <li><strong>Durasi:</strong> ${this.escapeHTML(proj.metrics.duration)}</li>
        <li><strong>Peran:</strong> ${this.escapeHTML(proj.metrics.role)}</li>
      </ul>
    `;

    const modalEl = document.getElementById('universalProjectModal');
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  },

  /* ------------------------------------------------------------
     SERVICES
     ------------------------------------------------------------ */
  async loadServices() {
    this.renderLoadingState(this.el.servicesContainer, 3);
    try {
      this.state.services = await ApiService.fetchServices();
      this.renderServices();
    } catch (err) {
      this.renderErrorState(
        this.el.servicesContainer,
        'Gagal memuat data layanan. Periksa koneksi internet Anda.'
      );
    }
  },

  renderServices() {
    if (this.state.services.length === 0) {
      this.renderEmptyState(this.el.servicesContainer, 'Belum ada paket layanan tersedia.');
      return;
    }

    this.el.servicesContainer.innerHTML = this.state.services.map((svc) => `
      <div class="col">
        <div class="card service-card h-100 shadow-sm border-0">
          <div class="card-body">
            <h3 class="h6 fw-bold">${this.escapeHTML(svc.name)}</h3>
            <p class="text-brand-accent fw-semibold small mb-2">${this.escapeHTML(svc.price)}</p>
            <p class="small text-muted">${this.escapeHTML(svc.description)}</p>
            <ul class="small text-muted ps-3 mb-0">
              ${svc.features.map((f) => `<li>${this.escapeHTML(f)}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `).join('');
  },

  /* ------------------------------------------------------------
     UI STATES GENERIK — dipakai ulang oleh Projects & Services
     ------------------------------------------------------------ */
  renderLoadingState(container, count = 3) {
    container.innerHTML = Array.from({ length: count }).map(() => `
      <div class="col">
        <div class="card h-100 border-0 shadow-sm placeholder-glow">
          <div class="placeholder project-thumb w-100"></div>
          <div class="card-body">
            <span class="placeholder col-4 mb-2 d-block"></span>
            <span class="placeholder col-8 d-block mb-2"></span>
            <span class="placeholder col-6 d-block"></span>
          </div>
        </div>
      </div>
    `).join('');
  },

  renderEmptyState(container, message) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
        <p class="text-muted mb-0">${this.escapeHTML(message)}</p>
      </div>
    `;
  },

  renderErrorState(container, message) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger d-flex align-items-start gap-2" role="alert">
          <i class="bi bi-exclamation-triangle-fill mt-1"></i>
          <div>${this.escapeHTML(message)}</div>
        </div>
      </div>
    `;
  },

  /* ------------------------------------------------------------
     FORM ASINKRON (Decoupled REST Dispatch) + TOAST + localStorage
     ------------------------------------------------------------ */
  async handleFormSubmit(e) {
    e.preventDefault(); // mencegah full page reload standar

    const form = this.el.contactForm;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const originalLabel = this.el.submitBtn.innerHTML;
    this.el.submitBtn.disabled = true;
    this.el.submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Mengirim...`;

    try {
      const result = await ApiService.submitServiceOrder(payload);
      this.saveOrderToLocalStorage(result);
      this.renderOrderBadge();
      this.showToast('Sukses!', 'Permintaan layanan berhasil dikirim. Kami akan segera menghubungi Anda.');
      form.reset();
      form.classList.remove('was-validated');
    } catch (err) {
      this.showToast('Gagal', err.message || 'Terjadi kesalahan saat mengirim permintaan.');
    } finally {
      this.el.submitBtn.disabled = false;
      this.el.submitBtn.innerHTML = originalLabel;
    }
  },

  saveOrderToLocalStorage(order) {
    const key = 'serviceOrders';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(order);
    localStorage.setItem(key, JSON.stringify(existing));
  },

  renderOrderBadge() {
    const existing = JSON.parse(localStorage.getItem('serviceOrders') || '[]');
    if (existing.length > 0) {
      this.el.orderBadge.textContent = existing.length;
      this.el.orderBadge.classList.remove('d-none');
    } else {
      this.el.orderBadge.classList.add('d-none');
    }
  },

  showToast(title, message) {
    this.el.toastTitle.textContent = title;
    this.el.toastMessage.textContent = message;
    const toast = bootstrap.Toast.getOrCreateInstance(this.el.toastEl);
    toast.show();
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());