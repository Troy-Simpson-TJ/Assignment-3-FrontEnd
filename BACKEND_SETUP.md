# Backend Setup Required for Assignment-3 Frontend

The frontend is now fully resilient and will work with ANY backend route structure. However, the backend must implement these endpoints and CORS configuration.

## 1. AUTHENTICATION Endpoints

**POST /auth/login** (or /api/auth/login, /login, /users/login, /auth/signin)
- Request body: `{ email, password }`
- Response: `{ user: { _id, firstName, lastName, email }, token: "jwt_token" }`
- HTTP Status: 200 on success

**POST /auth/signup** (or /api/auth/signup, /register, /users, /users/signup)
- Request body: `{ firstName, lastName, email, password }`
- Response: `{ user: { _id, firstName, lastName, email }, token: "jwt_token" }`
- HTTP Status: 200/201 on success

## 2. USERS Endpoints (Admin Management)

**GET /users** (or /api/users)
- Response: Array of users
  ```json
  [
    { "_id": "123", "firstName": "John", "lastName": "Doe", "email": "john@example.com" },
    { "_id": "456", "firstName": "Jane", "lastName": "Smith", "email": "jane@example.com" }
  ]
  ```
- HTTP Status: 200

**GET /users/:id** (or /api/users/:id)
- Response: Single user object
- HTTP Status: 200

**POST /users** (or /api/users)
- Request body: `{ firstName, lastName, email }`
- Response: Created user object with `_id`
- HTTP Status: 200/201

**PUT /users/:id** (or /api/users/:id)
- Request body: `{ firstName, lastName, email }`
- Response: Updated user object
- HTTP Status: 200

**DELETE /users/:id** (or /api/users/:id)
- Response: `{ success: true }` or empty 204 response
- HTTP Status: 200/204

## 3. PROJECTS Endpoints

**GET /projects** (or /api/projects)
- Response: Array of projects
  ```json
  [
    { "_id": "1", "imagePath": "/img/project1.jpg", "title": "Project 1", "text": "Description..." },
    { "_id": "2", "imagePath": "/img/project2.jpg", "title": "Project 2", "text": "Description..." }
  ]
  ```
- HTTP Status: 200

**POST /projects** (or /api/projects)
- Request body: `{ imagePath, title, text }`
- Response: Created project object with `_id`
- HTTP Status: 200/201

**PUT /projects/:id** (or /api/projects/:id)
- Request body: `{ imagePath, title, text }`
- Response: Updated project object
- HTTP Status: 200

**DELETE /projects/:id** (or /api/projects/:id)
- Response: `{ success: true }` or empty 204 response
- HTTP Status: 200/204

## 4. SERVICES Endpoints

**GET /services** (or /api/services)
- Response: Array of services (same structure as projects)
- HTTP Status: 200

**POST /services** (or /api/services)
- Request body: `{ imagePath, title, text }`
- Response: Created service object with `_id`
- HTTP Status: 200/201

**PUT /services/:id** (or /api/services/:id)
- Request body: `{ imagePath, title, text }`
- Response: Updated service object
- HTTP Status: 200

**DELETE /services/:id** (or /api/services/:id)
- Response: `{ success: true }` or empty 204 response
- HTTP Status: 200/204

## 5. CONTACTS Endpoints

**GET /contacts** (or /api/contacts)
- Response: Array of contacts
  ```json
  [
    { "_id": "1", "firstName": "John", "lastName": "Doe", "phone": "555-1234", "email": "john@example.com", "message": "Hello..." },
    { "_id": "2", "firstName": "Jane", "lastName": "Smith", "phone": "555-5678", "email": "jane@example.com", "message": "Hi..." }
  ]
  ```
- HTTP Status: 200

**POST /contacts** (or /api/contacts)
- Request body: `{ firstName, lastName, phone, email, message }`
- Response: Created contact object with `_id`
- HTTP Status: 200/201

**PUT /contacts/:id** (or /api/contacts/:id)
- Request body: `{ firstName, lastName, phone, email, message }`
- Response: Updated contact object
- HTTP Status: 200

**DELETE /contacts/:id** (or /api/contacts/:id)
- Response: `{ success: true }` or empty 204 response
- HTTP Status: 200/204

## 6. CRITICAL: CORS Configuration

Add CORS middleware to allow requests from the frontend. Your backend must include:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',           // Local dev
    'http://localhost:3000',           // Local backend (if frontend on different port)
    'https://assignment-3-frontend-uq2k.onrender.com'  // Production frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Without CORS configuration, the deployed frontend will get "blocked by CORS policy" errors.**

## 7. Data Model - IMPORTANT: NO Username or Role Fields

The frontend user model ONLY includes:
- `_id` (ObjectId or string)
- `firstName` (string)
- `lastName` (string)
- `email` (string)
- (password is only used during login/signup, not returned in responses)

**Do NOT send `username` or `role` fields** - the frontend UI does not expect them.

## 8. Frontend Endpoint Discovery

The frontend tries multiple route patterns automatically. You only need to implement **ONE** path per resource:

| Resource | Pick ONE of these |
|----------|------------------|
| Login | `/auth/login` OR `/api/auth/login` OR `/login` OR `/users/login` OR `/auth/signin` |
| Signup | `/auth/signup` OR `/api/auth/signup` OR `/register` OR `/users` OR `/users/signup` |
| Users | `/users` OR `/api/users` |
| Projects | `/projects` OR `/api/projects` |
| Services | `/services` OR `/api/services` |
| Contacts | `/contacts` OR `/api/contacts` |

The frontend will automatically try all candidates and use the first one that returns a 200 response.

## 9. Error Handling

- **404 responses**: Frontend will try the next candidate endpoint
- **Non-404 errors** (400, 401, 500, etc.): Frontend will throw the error to the component

Always return appropriate HTTP status codes:
- `200/201`: Success
- `400`: Bad request (validation error)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found
- `500`: Server error

## 10. Testing Locally

1. Ensure backend runs on `http://localhost:3000` (or update `.env` in frontend with correct `VITE_API_BASE`)
2. Run frontend: `npm run dev` (runs on http://localhost:5173)
3. Open browser console to check for CORS or 404 errors
4. Check Network tab to see which endpoint path was successfully matched

## 11. Testing on Production

1. Backend must be deployed (e.g., Render, Heroku, AWS)
2. Update `VITE_API_BASE` in frontend `.env.production` or build config
3. Deploy frontend to same host or ensure CORS allows the frontend origin
4. Monitor browser console for any API errors

---

**Questions?** The frontend API client (`src/api.js`) has resilient endpoint discovery. If an endpoint fails with 404, it automatically tries the next candidate. Non-404 errors are thrown to the calling component with the original error message.
