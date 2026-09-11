// Authentication Management
const AUTH_API_BASE_URL = 'http://localhost:3000/api';

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const token = getToken();
    const currentPage = window.location.pathname;

    // Jika user tidak login dan bukan di halaman login, redirect ke login
    if (!token && !currentPage.includes('login.html')) {
        window.location.href = '/login.html';
    }

    // Jika user sudah login dan di halaman login, redirect ke dashboard
    if (token && currentPage.includes('login.html')) {
        window.location.href = '/index.html';
    }

    // Setup login form jika di halaman login
    if (currentPage.includes('login.html')) {
        setupLoginForm();
    }

    // Setup user info jika tidak di halaman login
    if (token && !currentPage.includes('login.html')) {
        setupUserInfo();
    }
});

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function setupUserInfo() {
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                userNameElement.textContent = user.username || 'User';
            } catch (e) {
                userNameElement.textContent = 'User';
            }
        }
    }
}

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validasi input
    if (!username || !password) {
        showLoginAlert('Username dan password harus diisi', 'danger');
        return;
    }

    // Disable button dan show loading
    const loginBtn = document.getElementById('loginBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btnText = document.getElementById('btnText');

    loginBtn.disabled = true;
    loadingSpinner.classList.add('show');
    btnText.textContent = 'Sedang login...';

    // API call untuk login
    fetch(`${AUTH_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(response => {
        loginBtn.disabled = false;
        loadingSpinner.classList.remove('show');
        btnText.textContent = 'Masuk';

        if (response.success && response.data && response.data.token) {
            // Simpan token
            setToken(response.data.token);
            
            // Simpan user info
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            // Simpan preference "remember me"
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('savedUsername', username);
            }

            showLoginAlert('Login berhasil! Mengalihkan...', 'success');
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1500);
        } else {
            const errorMessage = response.message || 'Login gagal. Silakan coba lagi.';
            showLoginAlert(errorMessage, 'danger');
        }
    })
    .catch(error => {
        loginBtn.disabled = false;
        loadingSpinner.classList.remove('show');
        btnText.textContent = 'Masuk';
        console.error('Login Error:', error);
        showLoginAlert('Error: ' + error.message, 'danger');
    });
}

function showLoginAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    const iconClass = type === 'success' ? 'check-circle' : 'exclamation-circle';
    const titleText = type === 'success' ? 'Sukses!' : 'Error!';

    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="bi bi-${iconClass}"></i>
            <strong>${titleText}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    alertContainer.innerHTML = alertHTML;

    // Auto dismiss after 5 seconds (kecuali error)
    if (type !== 'danger') {
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        removeToken();
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }
}

// Auto-fill username jika "remember me" enabled
window.addEventListener('load', function() {
    if (window.location.pathname.includes('login.html')) {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const savedUsername = localStorage.getItem('savedUsername');

        if (rememberMe && savedUsername) {
            document.getElementById('username').value = savedUsername;
            document.getElementById('rememberMe').checked = true;
            document.getElementById('password').focus();
        }
    }
});
