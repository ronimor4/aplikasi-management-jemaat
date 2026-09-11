# API Documentation - Aplikasi Manajemen Jemaat

## Base URL

```
http://localhost:3000/api
```

## Authentication

Semua endpoint (kecuali login) memerlukan JWT Token di header:

```
Authorization: Bearer <token>
```

## Response Format

Semua response menggunakan format JSON:

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

---

## 1. Authentication Endpoints

### Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user dengan username dan password

**Request:**

```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com"
    }
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "message": "Invalid username or password",
  "data": null
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

---

## 2. Keluarga Endpoints

### Get All Keluarga

**Endpoint:** `GET /keluarga`

**Description:** Get daftar semua keluarga

**Headers:**

```
Authorization: Bearer <token>
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nama_bapak": "John Doe",
      "nama_ibu": "Jane Doe",
      "sektor": "A"
    }
  ]
}
```

**cURL Example:**

```bash
curl -X GET "http://localhost:3000/api/keluarga" \
  -H "Authorization: Bearer <token>"
```

---

## 3. Jemaat Endpoints

### Get Ulang Tahun

**Endpoint:** `GET /ulang-tahun`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| tanggal_lahir_awal | string | Format: dd/mm/yyyy |
| tanggal_lahir_akhir | string | Format: dd/mm/yyyy |

**Headers:**

```
Authorization: Bearer <token>
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...]
}
```

---

### Get Meninggal

**Endpoint:** `GET /meninggal`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| bulan | number | Bulan (1-12) |
| tahun | number | Tahun |

**Headers:**

```
Authorization: Bearer <token>
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

**Last Updated:** 2024-01-15
