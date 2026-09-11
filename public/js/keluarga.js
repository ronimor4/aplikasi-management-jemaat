// Keluarga Management
let currentKeluargaId = null;
let keluargaModal = null;

document.addEventListener('DOMContentLoaded', function() {
    keluargaModal = new bootstrap.Modal(document.getElementById('keluargaModal'));
    loadKeluarga();
    setupEventListeners();
});

function setupEventListeners() {
    // Reset form ketika modal ditutup
    document.getElementById('keluargaModal').addEventListener('hidden.bs.modal', function() {
        document.getElementById('keluargaForm').reset();
        currentKeluargaId = null;
        document.getElementById('modalTitle').textContent = 'Tambah Keluarga Baru';
    });

    // Submit button
    document.getElementById('submitBtn').addEventListener('click', saveKeluarga);
}

function loadKeluarga() {
    showLoading(true);
    showTable(false);

    keluargaAPI.getAll()
        .then(response => {
            showLoading(false);
            
            if (response.success && response.data) {
                displayKeluargaTable(response.data);
                showTable(true);
            } else {
                showAlert('Gagal memuat data keluarga', 'danger');
            }
        })
        .catch(error => {
            showLoading(false);
            showAlert('Error: ' + error.message, 'danger');
        });
}

function displayKeluargaTable(data) {
    const tbody = document.getElementById('keluargaTableBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Tidak ada data keluarga</td></tr>';
        return;
    }

    data.forEach((keluarga, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <strong>${keluarga.nama_bapak || '-'}</strong><br>
                <small class="text-muted">${keluarga.nomor_identitas_bapak || ''}</small>
            </td>
            <td>
                <strong>${keluarga.nama_ibu || '-'}</strong><br>
                <small class="text-muted">${keluarga.nomor_identitas_ibu || ''}</small>
            </td>
            <td>
                <span class="badge bg-info">${keluarga.sektor || '-'}</span>
            </td>
            <td>
                <span class="badge bg-success">${keluarga.jumlah_anak || 0} anak</span>
            </td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewDetail('${keluarga.id}')" title="Detail">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editKeluarga('${keluarga.id}')" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteKeluarga('${keluarga.id}')" title="Hapus">
                    <i class="bi bi-trash"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="generateKartuKeluarga('${keluarga.id}')" title="Kartu Keluarga">
                    <i class="bi bi-file-pdf"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editKeluarga(keluargaId) {
    currentKeluargaId = keluargaId;
    document.getElementById('modalTitle').textContent = 'Edit Keluarga';
    keluargaModal.show();
    
    // Load data keluarga untuk di-edit
    keluargaAPI.getById(keluargaId)
        .then(response => {
            if (response.success && response.data) {
                const keluarga = response.data;
                document.getElementById('sektor').value = keluarga.sektor || '';
                document.getElementById('bapak').value = keluarga.nama_bapak || '';
                document.getElementById('ibu').value = keluarga.nama_ibu || '';
            }
        })
        .catch(error => {
            showAlert('Error: ' + error.message, 'danger');
        });
}

function saveKeluarga() {
    const sektor = document.getElementById('sektor').value;
    const bapak = document.getElementById('bapak').value;
    const ibu = document.getElementById('ibu').value;

    if (!sektor) {
        showAlert('Sektor harus dipilih', 'warning');
        return;
    }

    const data = {
        sektor: sektor,
        nama_bapak: bapak || null,
        nama_ibu: ibu || null
    };

    if (currentKeluargaId) {
        // Update
        keluargaAPI.update(currentKeluargaId, data)
            .then(response => {
                if (response.success) {
                    showAlert('Keluarga berhasil diupdate');
                    keluargaModal.hide();
                    loadKeluarga();
                } else {
                    showAlert('Gagal update keluarga: ' + response.message, 'danger');
                }
            })
            .catch(error => {
                showAlert('Error: ' + error.message, 'danger');
            });
    } else {
        // Create
        keluargaAPI.create(data)
            .then(response => {
                if (response.success) {
                    showAlert('Keluarga berhasil ditambahkan');
                    keluargaModal.hide();
                    loadKeluarga();
                } else {
                    showAlert('Gagal tambah keluarga: ' + response.message, 'danger');
                }
            })
            .catch(error => {
                showAlert('Error: ' + error.message, 'danger');
            });
    }
}

function deleteKeluarga(keluargaId) {
    if (confirm('Apakah Anda yakin ingin menghapus keluarga ini?')) {
        keluargaAPI.delete(keluargaId)
            .then(response => {
                if (response.success) {
                    showAlert('Keluarga berhasil dihapus');
                    loadKeluarga();
                } else {
                    showAlert('Gagal hapus keluarga: ' + response.message, 'danger');
                }
            })
            .catch(error => {
                showAlert('Error: ' + error.message, 'danger');
            });
    }
}

function viewDetail(keluargaId) {
    keluargaAPI.getById(keluargaId)
        .then(response => {
            if (response.success && response.data) {
                const keluarga = response.data;
                const detailContent = document.getElementById('detailContent');
                
                let html = `
                    <div class="row">
                        <div class="col-md-6">
                            <h6 class="fw-bold mb-3">Data Bapak</h6>
                            <p><strong>Nama:</strong> ${keluarga.nama_bapak || '-'}</p>
                            <p><strong>No. Identitas:</strong> ${keluarga.nomor_identitas_bapak || '-'}</p>
                            <p><strong>Tempat Lahir:</strong> ${keluarga.tempat_lahir_bapak || '-'}</p>
                            <p><strong>Tanggal Lahir:</strong> ${formatDate(keluarga.tanggal_lahir_bapak) || '-'}</p>
                        </div>
                        <div class="col-md-6">
                            <h6 class="fw-bold mb-3">Data Ibu</h6>
                            <p><strong>Nama:</strong> ${keluarga.nama_ibu || '-'}</p>
                            <p><strong>No. Identitas:</strong> ${keluarga.nomor_identitas_ibu || '-'}</p>
                            <p><strong>Tempat Lahir:</strong> ${keluarga.tempat_lahir_ibu || '-'}</p>
                            <p><strong>Tanggal Lahir:</strong> ${formatDate(keluarga.tanggal_lahir_ibu) || '-'}</p>
                        </div>
                    </div>
                    <hr>
                    <h6 class="fw-bold mb-3">Info Keluarga</h6>
                    <p><strong>Sektor:</strong> ${keluarga.sektor || '-'}</p>
                    <p><strong>Alamat:</strong> ${keluarga.alamat || '-'}</p>
                    <p><strong>Nomor Telepon:</strong> ${keluarga.nomor_telepon || '-'}</p>
                    <p><strong>Jumlah Anak:</strong> ${keluarga.jumlah_anak || 0}</p>
                `;

                detailContent.innerHTML = html;
                const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
                detailModal.show();
            }
        })
        .catch(error => {
            showAlert('Error: ' + error.message, 'danger');
        });
}

function generateKartuKeluarga(keluargaId) {
    showLoading(true);
    kartuKeluargaAPI.generate(keluargaId)
        .then(response => {
            showLoading(false);
            if (response.success) {
                // Download PDF
                const link = document.createElement('a');
                link.href = response.file_url;
                link.download = `Kartu_Keluarga_${keluargaId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showAlert('Kartu Keluarga berhasil di-generate');
            } else {
                showAlert('Gagal generate kartu keluarga: ' + response.message, 'danger');
            }
        })
        .catch(error => {
            showLoading(false);
            showAlert('Error: ' + error.message, 'danger');
        });
}
