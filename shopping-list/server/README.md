# Shopping List API – Backend Documentation

This document describes the backend API for the Shopping List app.
All `/shopItem` routes are **protected** and require a valid JWT in the `Authorization` header.

From the /server/ directory, run:
```bash
$ node --env-file=config.env server
```
**Note:** Your config.env file must contain the following fields, where ```<<userXYZ>>``` is replaced with the tester's MongoDB details:
```javascript
ATLAS_URI="mongodb+srv://<<username>>:<<userPassword>>@<<userDatabase>>.abcde.mongodb.net/?appName=<<userCluster>>"
JWT_SECRET="secret_key"
PORT=5050
```
Base URL (development):
```
http://localhost:5050
```

---

## 🔐 Authentication Routes

### **POST /auth/register**

- Create a new user account.

**Request Body**
```json
{
  "email": "example@example.com",
  "password": "mypassword123"
}
```

**Responses**
- `201 Created`  
  ```json
  { "message": "User created" }
  ```
- `400 Bad Request` — missing fields  
- `409 Conflict` — user already exists  
- `500 Server Error`  

**Example**
```bash
curl -X POST http://localhost:5050/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com", "password":"123456"}'
```

---

### **POST /auth/login**

- Authenticate the user and return a JWT.

**Request Body**
```json
{
  "email": "example@example.com",
  "password": "mypassword123"
}
```

**Response**
- `200 OK`
```json
{
  "token": "your-jwt-token-here"
}
```
- `401 Unauthorized` — invalid credentials  
- `500 Server Error`  

**Example**
```bash
curl -X POST http://localhost:5050/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com", "password":"123456"}'
```

---

### **GET /auth/me**

- Get information about the currently logged-in user.

**Headers**
```
Authorization: Bearer <token>
```

**Response**
- `200 OK`
```json
{
  "_id": "651c3d7a93c1237efbc12345",
  "email": "test@test.com",
  "createdAt": "2023-10-03T10:23:51.123Z"
}
```
- `401 Unauthorized`  
- `404 Not Found`

**Example**
```bash
curl http://localhost:5050/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## 🛒 Shopping Item Routes (Protected)

All `/shopItem` routes **require authentication**.

### Headers (required)
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

### **GET /shopItem**

- Get all shopping items belonging to the logged-in user.

**Response**
- `200 OK`
```json
[
  {
    "_id": "651c3ff893c1237efbc12346",
    "name": "Milk",
    "amount": "2",
    "notes": "Low fat",
    "isChecked": false,
    "userId": "651c3d7a93c1237efbc12345"
  }
]
```

**Example**
```bash
curl http://localhost:5050/shopItem \
  -H "Authorization: Bearer <token>"
```

---

### **GET /shopItem/:id**

- Get a single item owned by the logged-in user.

**Responses**
- `200 OK` — returns item  
- `404 Not Found` — no item with that ID belonging to the user

**Example**
```bash
curl http://localhost:5050/shopItem/651c3ff893c1237efbc12346 \
  -H "Authorization: Bearer <token>"
```

---

### **POST /shopItem**

- Create a new shopping item.

**Request Body**
```json
{
  "name": "Flour",
  "amount": "1",
  "notes": "Spelt 1050",
  "isChecked": false
}
```

**Response**
- `201 Created` — returns inserted item metadata
```json
{
  "acknowledged": true,
  "insertedId": "692eccd5f81de2532f67711a"
}
```

**Example**
```bash
curl -X POST http://localhost:5050/shopItem \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Flour", "amount":"1", "notes":"Spelt 1050", "isChecked":false}'
```

---

### **PATCH /shopItem/:id**

- Update an item owned by logged-in user.

**Request Body**
```json
{
  "isChecked": true
}
```

**Responses**
- `200 OK` — returns updated item  
- `404 Not Found` — not owned by user  

**Example**
```bash
curl -X PATCH http://localhost:5050/shopItem/692eccd5f81de2532f67711a \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"isChecked":true}'
```

---

### **DELETE /shopItem/:id**

Delete an item owned by the logged-in user.

**Response**
- `200 OK`
```json
{ "deletedCount": 1 }
```
- `404 Not Found`

**Example**
```bash
curl -X DELETE http://localhost:5050/shopItem/651c401893c1237efbc12347 \
  -H "Authorization: Bearer <token>"
```

---

## Summary

This API supports:

### Authentication
- Register
- Login
- Get current user

### Protected CRUD
- List all items
- View single item
- Create item
- Update item
- Delete item

All requests are tied to the authenticated `userId`.

---