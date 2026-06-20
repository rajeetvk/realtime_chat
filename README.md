# Real-Time Chat Application

A production-ready real-time chat application built with Node.js, Express, Socket.io, and Serverless PostgreSQL (Neon).

## 🚀 Current Status
This project is currently in active development, following a 5-Day roadmap to transform a basic Socket.io chat into a CV-worthy, production-ready application.

## 🛠 Tech Stack
* **Backend:** Node.js, Express.js
* **Real-Time Engine:** Socket.io
* **Database:** PostgreSQL (Neon Serverless)
* **Query Builder:** `pg-promise`

## ⚙️ Setup Instructions

1. Clone this repository and navigate into the folder.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your database connection string:
   ```env
   PORT=9000
   DATABASE_URL=postgresql://your_user:your_password@endpoint.neon.tech/dbname?sslmode=require
   ```
4. Initialize the database by creating the necessary tables:
   ```bash
   node scripts/init_db.js
   ```
5. Start the development server:
   ```bash
   node index.js
   ```
6. Open your browser and navigate to `http://localhost:9000`.

---

## 🗺 5-Day Development Roadmap

* [x] **Day 1: The Foundation** - Project architecture, Neon Postgres connection, and DB Table initialization.
* [x] **Day 2: Authentication** - User Registration, Login, Password Hashing (`bcrypt`), and Session Management (`JWT`).
* [x] **Day 3: Persisting Data** - Saving chat history to the database and a Premium UI/CSS makeover.
* [ ] **Day 4: Pro Features** - "User is typing..." indicators, online/offline status dots, and private chat rooms.
* [ ] **Day 5: Enterprise Scaling** - Redis Pub/Sub integration for horizontal server scaling, code polish, and final documentation.