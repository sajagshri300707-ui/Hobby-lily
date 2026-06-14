# Authentication API Documentation

Base URL: `/api/auth`

All authentication endpoints have a rate limit of 20 requests per 15 minutes per IP.

## Response Format

All successful authentication requests return a normalized JSON payload:

```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "5551234567",
    "avatar_color": "#A8C4D4"
  }
}
```

---

## 1. Standard Email Signup

**Endpoint:** `POST /signup`

Registers a new user with an email and password.

### Request Body
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

### Errors
- `400 Bad Request`: "All fields are required."
- `409 Conflict`: "Email already registered."

---

## 2. Standard Email Login

**Endpoint:** `POST /login`

Authenticates an existing user via email and password.

### Request Body
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

### Errors
- `400 Bad Request`: "Email and password are required."
- `401 Unauthorized`: "Invalid credentials."
- `401 Unauthorized`: "Invalid credentials. Try logging in with Google." *(If account has no password set)*

---

## 3. Phone Signup

**Endpoint:** `POST /phone/signup`

Registers a user using their phone number. Non-digit characters in the phone number are automatically stripped (e.g. `(555) 123-4567` becomes `5551234567`).

### Request Body
```json
{
  "name": "John Smith",
  "phone": "+1 (555) 123-4567",
  "otp": "123456"
}
```

### Errors
- `400 Bad Request`: "All fields are required."
- `401 Unauthorized`: "Invalid OTP."
- `409 Conflict`: "Phone number already registered."
- `429 Too Many Requests`: "Too many failed attempts. Try again in 15 minutes."

---

## 4. Phone Login

**Endpoint:** `POST /phone/login`

Authenticates an existing user via phone number and OTP.

### Request Body
```json
{
  "phone": "5551234567",
  "otp": "123456"
}
```

### Errors
- `400 Bad Request`: "Phone and OTP are required."
- `401 Unauthorized`: "Invalid OTP."
- `401 Unauthorized`: "Phone number not registered."
- `429 Too Many Requests`: "Too many failed attempts. Try again in 15 minutes."

---

## 5. Google Authentication (Signup / Login / Link)

**Endpoint:** `POST /google`

Authenticates a user via a Google OAuth payload. 
- If the `google_id` exists, it logs the user in.
- If the `google_id` does not exist but the `email` does, it **links the accounts**.
- If neither exists, it provisions a new user. 

*(Note: Production systems must verify the ID token server-side instead of trusting the raw profile payload).*

### Request Body
```json
{
  "google_id": "1048382940283...",
  "email": "user@gmail.com",
  "name": "Google User"
}
```

### Errors
- `400 Bad Request`: "Invalid Google payload."
