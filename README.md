# SantaOS Backend 🎅

The complete API server for **SantaOS** - The North Pole's Christmas Management System. Built with Node.js, Express, PostgreSQL, and Prisma ORM.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19.2-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2.0-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791.svg)](https://www.postgresql.org/)

---

## 🚀 Features

- **RESTful API**: Comprehensive endpoints for Users, Children, Tasks, Wishlists, Deliveries, and Analytics
- **Repository Pattern**: Clean architecture with separation of concerns
- **Database**: PostgreSQL with Prisma ORM for type-safe database access
- **Docker Support**: Easy database setup via Docker Compose
- **TypeScript**: Full type safety across the codebase
- **Authentication**: Role-based access control for Admin and Worker users
- **Real-time Analytics**: Demand forecasting and production planning
- **Delivery Management**: Full CRUD operations with public tracking support
- **Task Management**: Create, assign, and track tasks for workers
- **Automatic Delivery Creation**: Wishlists automatically generate trackable deliveries

---

## 📚 API Documentation

### Auth
- **POST** `/api/auth/login`
  - Login for Santa (Admin) and Elves (Workers)
  - Body: `{ email, password, role }`
  - Returns: User profile with role information

### Wishlists
- **POST** `/api/wishlists`
  - Create a new wishlist (creates child + wishlist + items + delivery)
  - Body: `{ name, age, location, status: 'nice'|'naughty', wishes: [{ item, priority }] }`
  - Returns: Created child, wishlist, items, **trackingId**, and **trackingCode**
- **GET** `/api/wishlists`
  - Retrieve all wishlists with child and item details
  - Returns: Array of wishlists with nested child and items
- **PATCH** `/api/wishlists/child/:childId/category`
  - Toggle child's Nice/Naughty status
  - Body: `{ category: 'nice'|'naughty' }`
  - Returns: Updated child object

### Tasks
- **GET** `/api/tasks/user/:userId`
  - Get all tasks assigned to a specific user (elf)
  - Returns: Array of tasks with details
- **PATCH** `/api/tasks/:taskId/status`
  - Update task status
  - Body: `{ status: 'pending'|'in_progress'|'completed' }`
  - Returns: Updated task object
- **GET** `/api/tasks`
  - Get all tasks with assignee details
  - Returns: Array of all tasks
- **POST** `/api/tasks`
  - Create a new task
  - Body: `{ title, description?, giftType, quantity?, assignedTo?, priority: 'high'|'medium'|'low', deadline? }`
  - Returns: Created task object
- **PATCH** `/api/tasks/:taskId/assign`
  - Assign task to a worker
  - Body: `{ userId }`
  - Returns: Updated task object

### Deliveries
- **GET** `/api/deliveries`
  - Get all deliveries (optionally filter by status with `?status=pending|in_transit|delivered`)
  - Returns: Array of deliveries with child details
- **GET** `/api/deliveries/:id`
  - Get a specific delivery by ID
  - Returns: Delivery object with child details
- **POST** `/api/deliveries`
  - Create a new delivery
  - Body: `{ childId?, region, address, giftItems: string[], deliveryDate? }`
  - Returns: Created delivery object
- **PATCH** `/api/deliveries/:id/status`
  - Update delivery status
  - Body: `{ status: 'pending'|'in_transit'|'delivered' }`
  - Returns: Updated delivery object
- **GET** `/api/deliveries/track/:trackingId`
  - Track delivery by tracking ID (public endpoint)
  - Returns: Limited delivery info (id, status, region, dates)

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

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 4.19.2
- **Database**: PostgreSQL (via Prisma ORM 7.2.0)
- **Language**: TypeScript 5.9.3
- **Containerization**: Docker & Docker Compose

---

## 🏗️ Architecture

This project follows the **Repository Pattern** to ensure separation of concerns and maintainability.

```
Request → Route → Controller → Service → Repository → Database
```

- **Controllers** (`src/controllers`): Handle HTTP requests, validate input, and send responses
- **Services** (`src/services`): Contain business logic (e.g., verifying credentials, creating deliveries)
- **Repositories** (`src/repositories`): Handle direct database interactions using Prisma
- **Routes** (`src/routes`): Define API endpoints and map them to controllers

---

## 📂 Project Structure

```text
backend/
├── src/
│   ├── controllers/      # HTTP request handlers
│   │   ├── auth.controller.ts
│   │   ├── task.controller.ts
│   │   ├── delivery.controller.ts
│   │   ├── wishlist.controller.ts
│   │   ├── analytics.controller.ts
│   │   └── user.controller.ts
│   ├── services/         # Business logic
│   │   ├── auth.service.ts
│   │   ├── task.service.ts
│   │   ├── delivery.service.ts
│   │   ├── wishlist.service.ts
│   │   └── analytics.service.ts
│   ├── repositories/     # Database access layer
│   │   ├── task.repository.ts
│   │   ├── delivery.repository.ts
│   │   ├── wishlist.repository.ts
│   │   ├── analytics.repository.ts
│   │   └── user.repository.ts
│   ├── routes/           # API route definitions
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── tasks.ts
│   │   ├── deliveries.ts
│   │   ├── wishlists.ts
│   │   ├── analytics.ts
│   │   └── users.ts
│   ├── lib/              # Shared utilities
│   │   └── prisma.ts
│   └── index.ts          # Entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── docker-compose.yml    # PostgreSQL container
├── .env                  # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📦 Setup Instructions

We use a **Hybrid** approach: Docker for the database, and local Node.js for the API.

### Prerequisites
- Node.js (v18 or higher)
- Docker & Docker Compose
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd santaOS/backend
```

### 2. Start the Database
From the backend directory (where `docker-compose.yml` is):
```bash
docker compose up -d
```

Verify the container is running:
```bash
docker ps
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
Create a `.env` file in the backend directory:
```env
PORT=3000
DATABASE_URL=postgres://santa:northpole123@localhost:5432/santaos
```

### 5. Database Setup (Migrate & Seed)
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

### 6. Build the Project
Compile the TypeScript code:
```bash
npm run build
```

### 7. Run the Server
For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm run start
```

*The server will start on http://localhost:3000*

### 8. Verify Installation
Test the health endpoint:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","message":"SantaOS Backend is running 🎅"}
```

---

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

---

## 🎯 Key Features Explained

### Automatic Delivery Creation
When a child submits a wishlist, the system automatically:
1. Creates a child record
2. Creates a wishlist with items
3. **Creates a delivery record** for tracking
4. Generates a tracking code (e.g., `SANTA-ABC12345`)
5. Returns the tracking code to the child

### Public Tracking Endpoint
The `/api/deliveries/track/:trackingId` endpoint is **public** (no authentication required) and returns limited information for privacy:
- Delivery ID
- Status (pending/in_transit/delivered)
- Region
- Delivery date
- Timestamps

It does **NOT** expose:
- Child's name
- Full address
- Gift details

---

## ⚠️ Known Limitations

### Partially Implemented
- **User Management**: No endpoints for creating/updating users (users are seeded via Prisma)
- **Wishlist Approval**: No workflow for approving/rejecting wishlist items
- **Real-time Updates**: No WebSocket support for live updates

### Current Workarounds
- Use Prisma Studio (`npx prisma studio`) to manually manage users
- Wishlist items can be viewed but approval workflow needs to be implemented
- Frontend uses polling (auto-refresh) instead of WebSockets

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL container is running
docker ps

# If not running, start it
docker compose up -d

# Check container logs
docker logs santaos-postgres
```

### Port Already in Use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill the process if needed
kill -9 <PID>

# Or change the port in .env
PORT=3001
```

### Prisma Migration Errors
```bash
# Reset database completely (WARNING: deletes all data)
npx prisma migrate reset

# Or manually drop and recreate
docker compose down -v
docker compose up -d
npx prisma migrate dev
npx prisma db seed
```

### CORS Errors
The server has CORS enabled for all origins. If you're still getting CORS errors:
1. Ensure the backend is running on the correct port
2. Check that frontend is making requests to the correct URL
3. Verify no proxy/firewall is blocking requests

---

## � Database Schema

### Models
- **User**: Admin (Santa) and Worker (Elves) accounts
- **Child**: Children who submit wishlists
- **Wishlist**: Container for wishlist items
- **WishlistItem**: Individual gift requests
- **Task**: Gift production tasks
- **Delivery**: Delivery tracking records

### Relationships
```
User (1) ----< (N) Task
Child (1) ----< (N) Wishlist
Child (1) ----< (N) Delivery
Wishlist (1) ----< (N) WishlistItem
```

---

## 🧪 Testing

### Manual Testing with curl

**Create a wishlist:**
```bash
curl -X POST http://localhost:3000/api/wishlists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emma Johnson",
    "age": 8,
    "location": "London, UK",
    "status": "nice",
    "wishes": [
      {"item": "LEGO Star Wars Set", "priority": "high"},
      {"item": "Bicycle", "priority": "medium"}
    ]
  }'
```

**Track a delivery:**
```bash
curl http://localhost:3000/api/deliveries/track/DELIVERY_ID
```

**Login as Santa:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "santa@northpole.com",
    "password": "hohoho",
    "role": "admin"
  }'
```

---

## 🚀 Deployment

### Environment Variables
For production, update `.env`:
```env
PORT=3000
DATABASE_URL=postgres://user:password@host:5432/database
NODE_ENV=production
```

### Build for Production
```bash
npm run build
npm run start
```

### Docker Deployment
The PostgreSQL database is already containerized. To containerize the API:
1. Create a `Dockerfile`
2. Build the image
3. Deploy to your preferred platform (AWS, GCP, Heroku, etc.)

---

## �📄 License

Made with ❤️ at the North Pole.

---

## 👥 Contributors

Built for the SantaOS Christmas Management System.

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Inspect logs: `docker logs santaos-postgres`
4. Use Prisma Studio to inspect the database

---

**Happy Coding! 🎅🎄**
