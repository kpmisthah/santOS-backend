# SantaOS Backend 🎅

The API server for **SantaOS**, the North Pole's operating system. Built with Node.js, Express, PostgreSQL, and Prisma ORM.

## 🚀 Features
- **RESTful API**: Comprehensive endpoints for Users, Children, Tasks, Deliveries, Wishlists, and Analytics
- **Repository Pattern**: Clean architecture with separation of concerns
- **Database**: PostgreSQL with Prisma ORM for type-safe database access
- **Docker Support**: Easy database setup via Docker Compose
- **TypeScript**: Full type safety across the codebase
- **Authentication**: Role-based access control for Admin and Worker users
- **Real-time Analytics**: Demand forecasting and production planning

## 📚 API Documentation

### Auth
- **POST** `/api/auth/login`
  - Login for Santa (Admin) and Elves (Workers)
  - Body: `{ email, password, role }`
  - Returns: User profile with role information

### Wishlists
- **POST** `/api/wishlists`
  - Create a new wishlist (creates child + wishlist + items)
  - Body: `{ name, age, location, status: 'nice'|'naughty', wishes: [{ item, priority }] }`
  - Returns: Created child, wishlist, and items
- **GET** `/api/wishlists`
  - Retrieve all wishlists with child and item details
  - Returns: Array of wishlists with nested child and items

### Analytics
- **GET** `/api/analytics/demand`
  - Get global and regional gift demand aggregation
  - Returns: `{ global_demand, regional_demand }`
- **GET** `/api/analytics/forecast`
  - Get production forecast and shortage alerts
  - Returns: Recommended production quantities per gift
- **GET** `/api/analytics/stats`
  - Get dashboard statistics (children, tasks, deliveries counts)
  - Returns: Aggregated counts for dashboard

### Users
- **GET** `/api/users`
  - Get list of system users (Santa, Elves)
  - Returns: Array of users (excluding passwords)

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL (via Prisma ORM)
- **Language**: TypeScript

## 🏗️ Architecture
This project follows the **Repository Pattern** to ensure separation of concerns and maintainability.

- **Controllers** (`src/controllers`): Handle HTTP requests, validate input, and send responses.
- **Services** (`src/services`): Contain business logic (e.g., verifying credentials, calculating scores).
- **Repositories** (`src/repositories`): Handle direct database interactions using Prisma.
- **Routes** (`src/routes`): Define API endpoints and map them to controllers.

## 📂 Project Structure
```text
src/
├── controllers/   # Request handlers
├── services/      # Business logic
├── repositories/  # Database access
├── routes/        # API route definitions
├── lib/           # Shared utilities (Prisma client)
├── db/            # Database scripts
└── index.ts       # Entry point
```

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

### 3. Configure Environment
Create a `.env` file in the backend directory:
```env
PORT=3000
DATABASE_URL=postgres://santa:northpole123@localhost:5432/santaos
```

### 4. Database Setup (Migrate & Seed)
Initialize the database schema:
```bash
npx prisma migrate dev --name init
```

Seed the database with initial data (Santa, Elves, sample children):
```bash
npx prisma db seed
```

This creates:
- **Admin User**: `santa@northpole.com` (password: `hohoho`)
- **Worker User**: `elf@workshop.com` (password: `hohoho`)
- Sample children and wishlists

### 5. Build the Project
Compile the TypeScript code:
```bash
npm run build
```

### 6. Run the Server
For development (with auto-reload):
```bash
npm run dev
```
For production:
```bash
npm run start
```
*The server will start on http://localhost:3000*

## 🔧 Development Tools

### Prisma Studio
View and edit your database in a GUI:
```bash
npx prisma studio
```

### Database Reset
To reset the database and re-seed:
```bash
npx prisma migrate reset
```

## 📄 License
Made with ❤️ at the North Pole.
