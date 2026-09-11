# Environment Variables Configuration

## Backend Configuration (.env)

Buat file `.env` di folder `backend/` dengan konfigurasi berikut:

```env
# ===================================
# SERVER CONFIGURATION
# ===================================
PORT=3000
NODE_ENV=development
HOST=localhost

# ===================================
# DATABASE CONFIGURATION
# ===================================
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=jemaat_db

# Connection Pool
DB_CONNECTION_LIMIT=10
DB_WAIT_FOR_CONNECTIONS=true
DB_QUEUE_LIMIT=0

# ===================================
# JWT CONFIGURATION
# ===================================
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_change_this_too
JWT_REFRESH_EXPIRES_IN=30d

# ===================================
# CORS CONFIGURATION
# ===================================
CORS_ORIGIN=http://localhost:8000,http://localhost:3000
CORS_CREDENTIALS=true
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_ALLOWED_HEADERS=Content-Type,Authorization

# ===================================
# FILE UPLOAD CONFIGURATION
# ===================================
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
PDF_OUTPUT_DIR=./uploads/pdf

# ===================================
# EMAIL CONFIGURATION (Optional)
# ===================================
EMAIL_SERVICE=gmail
EMAIL_FROM=noreply@jemaat.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# ===================================
# LOGGING CONFIGURATION
# ===================================
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# ===================================
# API CONFIGURATION
# ===================================
API_VERSION=v1
API_PREFIX=/api

# ===================================
# SECURITY CONFIGURATION
# ===================================
BCRYPT_ROUNDS=10
SESSION_SECRET=your_session_secret_key
RATIO_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Setup Instructions

### Step 1: Copy Template

```bash
cd backend
cp .env.example .env
```

### Step 2: Edit `.env` File

```bash
nano .env
```

### Step 3: Konfigurasi Database

```bash
# Update DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=jemaat_db
```

### Step 4: Generate JWT Secret

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (menggunakan Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy hasilnya ke `JWT_SECRET` dan `JWT_REFRESH_SECRET`

### Step 5: Test Configuration

```bash
node server.js
```

Seharusnya output:
```
Server running on port 3000
Database connected
```

## Best Practices

### Security

1. **Never commit .env ke git**
   ```bash
   # .gitignore
   .env
   .env.local
   .env.*.local
   ```

2. **Gunakan strong secret keys**
   - Minimal 32 characters
   - Mix uppercase, lowercase, numbers, symbols
   - Generate dengan cryptographic tools

3. **Update secrets untuk production**
   - Jangan gunakan default values
   - Setiap environment punya secret berbeda

4. **Restrict .env permissions**
   ```bash
   chmod 600 .env
   ```

---

**Last Updated:** 2024-01-15
