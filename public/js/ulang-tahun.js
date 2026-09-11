// Ulang Tahun Management
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('filterBtn').addEventListener('click', filterUlangTahun);
    
    // Load default data ketika halaman dibuka
    loadUlangTahunDefault();
}

function loadUlangTahunDefault() {
    // Load data bulan ini sampai bulan depan
    const today = new Date();
    const tanggalAwal = new Date(today.getFullYear(), today.getMonth(), 1);
    const tanggalAkhir = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    
    const awal = formatDateToInput(tanggalAwal);
    const akhir = formatDateToInput(tanggalAkhir);
    
    document.getElementById('tanggalAwal').value = awal;
    document.getElementById('tanggalAkhir').value = akhir;
    
    loadUlangTahun(awal, akhir);
}

function filterUlangTahun() {
    const tanggalAwal = document.getElementById('tanggalAwal').value;
    const tanggalAkhir = document.getElementById('tanggalAkhir').value;

    if (!tanggalAwal || !tanggalAkhir) {
        showAlert('Tanggal awal dan akhir harus diisi', 'warning');
        return;
    }

    loadUlangTahun(tanggalAwal, tanggalAkhir);
}

function loadUlangTahun(tanggalAwal, tanggalAkhir) {
    showLoading(true);
    showTable(false);

    ulangTahunAPI.get(tanggalAwal, tanggalAkhir)
        .then(response => {
            showLoading(false);
            
            if (response.success && response.data) {
                displayUlangTahunTable(response.data);
                showTable(true);
            } else {
                showAlert('Gagal memuat data ulang tahun', 'danger');
            }
        })
        .catch(error => {
            showLoading(false);
            showAlert('Error: ' + error.message, 'danger');
        });
}

function displayUlangTahunTable(data) {
    const tbody = document.getElementById('ulangTahunTableBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Tidak ada data ulang tahun dalam periode ini</td></tr>';
        return;
    }

    data.forEach((jemaat, index) => {
        const birthDate = new Date(jemaat.tanggal_lahir);
        const age = calculateAge(birthDate);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <strong>${jemaat.nama_lengkap || '-'}</strong><br>
                <small class="text-muted">${jemaat.nomor_identitas || ''}</small>
            </td>
            <td>${formatDate(jemaat.tanggal_lahir) || '-'}</td>
            <td>
                <span class="badge bg-success">${age} tahun</span>
            </td>
            <td>
                <span class="badge ${jemaat.jenis_kelamin === 'Laki-laki' ? 'bg-primary' : 'bg-danger'}">
                    ${jemaat.jenis_kelamin || '-'}
                </span>
            </td>
            <td>
                <span class="badge bg-info">${jemaat.sektor || '-'}</span>
            </td>
        `;
        tbody.appendChild(row);
    });
}
