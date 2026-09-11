// Meninggal Management
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('filterBtn').addEventListener('click', filterMeninggal);
    
    // Load default data untuk bulan ini
    loadMeninggalDefault();
}

function loadMeninggalDefault() {
    const today = new Date();
    const bulan = today.getMonth() + 1;
    const tahun = today.getFullYear();
    
    document.getElementById('bulan').value = bulan;
    document.getElementById('tahun').value = tahun;
    
    loadMeninggal(bulan, tahun);
}

function filterMeninggal() {
    const bulan = document.getElementById('bulan').value;
    const tahun = document.getElementById('tahun').value;

    if (!bulan || !tahun) {
        showAlert('Bulan dan tahun harus dipilih', 'warning');
        return;
    }

    loadMeninggal(bulan, tahun);
}

function loadMeninggal(bulan, tahun) {
    showLoading(true);
    showTable(false);

    meninggalAPI.get(bulan, tahun)
        .then(response => {
            showLoading(false);
            
            if (response.success && response.data) {
                displayMeninggalTable(response.data);
                showTable(true);
            } else {
                showAlert('Gagal memuat data meninggal', 'danger');
            }
        })
        .catch(error => {
            showLoading(false);
            showAlert('Error: ' + error.message, 'danger');
        });
}

function displayMeninggalTable(data) {
    const tbody = document.getElementById('meninggalTableBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Tidak ada data jemaat meninggal pada periode ini</td></tr>';
        return;
    }

    data.forEach((jemaat, index) => {
        const birthDate = new Date(jemaat.tanggal_lahir);
        const deathDate = new Date(jemaat.tanggal_meninggal);
        const ageAtDeath = calculateAgeAtDeath(birthDate, deathDate);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <strong>${jemaat.nama_lengkap || '-'}</strong><br>
                <small class="text-muted">${jemaat.nomor_identitas || ''}</small>
            </td>
            <td>${formatDate(jemaat.tanggal_lahir) || '-'}</td>
            <td>${formatDate(jemaat.tanggal_meninggal) || '-'}</td>
            <td>
                <span class="badge bg-warning text-dark">${ageAtDeath} tahun</span>
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

function calculateAgeAtDeath(birthDate, deathDate) {
    let age = deathDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = deathDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && deathDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}
