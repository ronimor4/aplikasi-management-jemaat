// Dashboard Management
document.addEventListener('DOMContentLoaded', function() {
    setupDashboard();
});

function setupDashboard() {
    // Set current date
    setCurrentDate();

    // Load statistics
    loadDashboardStats();
}

function setCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const today = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        currentDateElement.textContent = today.toLocaleDateString('id-ID', options);
    }
}

function loadDashboardStats() {
    // Load total keluarga
    loadTotalKeluarga();

    // Load ulang tahun bulan ini
    loadUlangTahunBulanIni();

    // Load meninggal bulan ini
    loadMeninggalBulanIni();
}

function loadTotalKeluarga() {
    keluargaAPI.getAll()
        .then(response => {
            if (response.success && response.data) {
                const totalElement = document.getElementById('totalKeluarga');
                if (totalElement) {
                    totalElement.textContent = response.data.length || 0;
                }
            }
        })
        .catch(error => {
            console.error('Error loading total keluarga:', error);
            document.getElementById('totalKeluarga').textContent = '0';
        });
}

function loadUlangTahunBulanIni() {
    const today = new Date();
    
    // Dari hari ini hingga akhir bulan ini
    const tanggalAwal = formatDateToInput(today);
    const tanggalAkhir = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const akhir = formatDateToInput(tanggalAkhir);

    ulangTahunAPI.get(tanggalAwal, akhir)
        .then(response => {
            if (response.success && response.data) {
                const totalElement = document.getElementById('totalUlangTahun');
                if (totalElement) {
                    totalElement.textContent = response.data.length || 0;
                }
            }
        })
        .catch(error => {
            console.error('Error loading ulang tahun:', error);
            document.getElementById('totalUlangTahun').textContent = '0';
        });
}

function loadMeninggalBulanIni() {
    const today = new Date();
    const bulan = today.getMonth() + 1;
    const tahun = today.getFullYear();

    meninggalAPI.get(bulan, tahun)
        .then(response => {
            if (response.success && response.data) {
                const totalElement = document.getElementById('totalMeninggal');
                if (totalElement) {
                    totalElement.textContent = response.data.length || 0;
                }
            }
        })
        .catch(error => {
            console.error('Error loading meninggal:', error);
            document.getElementById('totalMeninggal').textContent = '0';
        });
}
