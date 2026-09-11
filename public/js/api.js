// Public API Helper - Frontend Integration

const API_BASE_URL = 'http://localhost:3000/api';

// Keluarga API
const keluargaAPI = {
  async getAll(page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/keluarga?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching keluarga:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/keluarga/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching keluarga:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/keluarga`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating keluarga:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/keluarga/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating keluarga:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/keluarga/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting keluarga:', error);
      throw error;
    }
  }
};

// Ulang Tahun API
const ulangTahunAPI = {
  async get(tanggalAwal, tanggalAkhir, page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ulang-tahun?tanggal_lahir_awal=${tanggalAwal}&tanggal_lahir_akhir=${tanggalAkhir}&page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching ulang tahun:', error);
      throw error;
    }
  }
};

// Meninggal API
const meninggalAPI = {
  async get(bulan, tahun, page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/meninggal?bulan=${bulan}&tahun=${tahun}&page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching meninggal:', error);
      throw error;
    }
  }
};

// Token Management
function getToken() {
  return localStorage.getItem('token') || '';
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

// Date Helper
function formatDateToInput(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}/${month}/${d.getFullYear()}`;
}

function formatDateDisplay(date) {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
