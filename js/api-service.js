/**
 * api-service.js
 * ------------------------------------------------------------------
 * Data Access Layer (Application / Service Logic Tier).
 * Semua komunikasi ke "sumber data" (file JSON lokal yang berperan
 * sebagai mock REST provider) terpusat di sini, terpisah dari logika
 * tampilan (app.js). Ini menerapkan prinsip Separation of Concerns:
 * app.js tidak perlu tahu BAGAIMANA data diambil, cukup tahu APA
 * yang dikembalikan.
 * ------------------------------------------------------------------
 */

const ApiService = (() => {

  /**
   * Fungsi generik untuk mengambil & mem-parsing JSON,
   * dengan defensive error handling sesuai anjuran modul.
   */
  async function fetchJSON(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`[API Network Error] Gagal memuat ${path}:`, err);
      throw err;
    }
  }

  function fetchProfile() {
    return fetchJSON('./data/profile.json');
  }

  function fetchProjects() {
    return fetchJSON('./data/projects.json');
  }

  function fetchServices() {
    return fetchJSON('./data/services.json');
  }

  /**
   * Simulasi pengiriman formulir ke REST API (mock endpoint).
   * Tidak ada server backend sungguhan di tugas ini, jadi kita
   * mensimulasikan latensi jaringan dan respons sukses/gagal
   * memakai Promise + setTimeout, supaya UI tetap bisa menampilkan
   * status "mengirim..." secara realistis.
   */
  function submitServiceOrder(payload) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validasi sangat sederhana di sisi "server" tiruan
        if (!payload.email || !payload.nama) {
          reject(new Error('Data wajib tidak lengkap.'));
          return;
        }
        resolve({
          status: 'success',
          orderId: 'ORD-' + Date.now(),
          receivedAt: new Date().toISOString(),
          payload
        });
      }, 900); // simulasi latensi jaringan ~900ms
    });
  }

  return {
    fetchProfile,
    fetchProjects,
    fetchServices,
    submitServiceOrder
  };

})();