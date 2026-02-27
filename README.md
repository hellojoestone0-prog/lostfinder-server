# PhoneFinder Server

Node.js + Express backend.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env: MONGO_URI, JWT_SECRET, ENCRYPTION_KEY
npm run dev
```

## Structure

```
server/
├── config/       # DB connection
├── controllers/  # Route handlers
├── middleware/   # Auth, etc.
├── models/       # Mongoose schemas
├── routes/       # API routes
├── services/     # FCM, etc.
├── utils/        # Encryption, etc.
└── server.js
```
