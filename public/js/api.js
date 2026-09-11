// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function untuk get token dari localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Helper function untuk set token
function setToken(token) {
    localStorage.setItem('token', token);
}

// Helper function untuk remove token
function removeToken() {
    localStorage.removeItem('token');
}

// API Call dengan authentication
function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    return fetch(`${API_BASE_URL}${endpoint}`, options)
        .then(response => {
            if (response.status === 401) {
                // Token expired atau invalid
                removeToken();
                window.location.href = '/login.html';
                throw new Error('Token expired. Please login again.');
            }
            return response.json();
        })
        .catch(error => {
            console.error('API Error:', error);
            throw error;
        });
}

// ============ KELUARGA API ============
const keluargaAPI = {
    getAll: () => apiCall('/keluarga'),
    getById: (id) => apiCall(`/keluarga/${id}`),
    create: (data) => apiCall('/keluarga', 'POST', data),
    update: (id, data) => apiCall(`/keluarga/${id}`, 'PUT', data),
    delete: (id) => apiCall(`/keluarga/${id}`, 'DELETE')
};

// ============ ULANG TAHUN API ============
const ulangTahunAPI = {
    get: (tanggalAwal, tanggalAkhir) => {
        let endpoint = '/ulang-tahun?';
        if (tanggalAwal) endpoint += `tanggal_lahir_awal=${tanggalAwal}&`;
        if (tanggalAkhir) endpoint += `tanggal_lahir_akhir=${tanggalAkhir}`;
        return apiCall(endpoint);
    }
};

// ============ MENINGGAL API ============
const meninggalAPI = {
    get: (bulan, tahun) => {
        let endpoint = '/meninggal?';
        if (bulan) endpoint += `bulan=${bulan}&`;
        if (tahun) endpoint += `tahun=${tahun}`;
        return apiCall(endpoint);
    }
};

// ============ KARTU KELUARGA API ============
const kartuKeluargaAPI = {
    generate: (keluargaId) => apiCall(`/kartu-keluarga/generate/${keluargaId}`)
};

// Helper function untuk show alert
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <strong>${type === 'success' ? 'Sukses!' : 'Error!'}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    alertContainer.innerHTML = alertHTML;

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Helper function untuk show loading
function showLoading(show = true) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

// Helper function untuk show table
function showTable(show = true) {
    const table = document.getElementById('tableContainer');
    if (table) {
        table.style.display = show ? 'block' : 'none';
    }
}

// Helper function untuk calculate age
function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

// Helper function untuk format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

// Helper function untuk format date to dd/mm/yyyy
function formatDateToInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Helper function untuk parse date from dd/mm/yyyy
function parseDateFromInput(dateString) {
    if (!dateString) return null;
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    return new Date(parts[2], parts[1] - 1, parts[0]);
}
