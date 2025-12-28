# SantaOS Backend 🎅

The API server for **SantaOS**, the North Pole's operating system. Built with Node.js, Express, and PostgreSQL.

## 🚀 Features
- **RESTful API**: Endpoints for Users, Children, Tasks, and Deliveries.
- **Database**: PostgreSQL integration for structured North Pole data.
- **Docker Support**: Easy database setup via Docker Compose.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **Language**: TypeScript

## 📦 Setup Instructions

We use a **Hybrid** approach: Docker for the database, and local Node.js for the API.

### 1. Start the Database
From the backend directory (where `docker-compose.yml` is):
```bash
docker compose up -d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup (Migrate & Seed)
Initialize the database schema and load initial data (Santa, Elves, Children):
```bash
npx prisma migrate dev --name init
```

### 4. Build the Project
Compile the TypeScript code:
```bash
npm run build
```

### 5. Run the Server
For development (with auto-reload):
```bash
npm run dev
```
For production:
```bash
npm run start
```
*The server will start on http://localhost:3000*

## 📝 Environment Variables
Create a `.env` file in this directory:
```env
PORT=3000
DATABASE_URL=postgres://santa:northpole123@localhost:5432/santaos
```

## 📄 License
Made with ❤️ at the North Pole.
