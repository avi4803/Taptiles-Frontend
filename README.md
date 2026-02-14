# 🎮 TapTile - Competitive Real-Time Tile Claiming Game

![TapTile Banner](https://via.placeholder.com/1200x500.png?text=TapTile+Gameplay+Showcase)  
*(Replace this link with a screenshot of your actual game)*

**TapTile** is a fast-paced multiplayer game where players compete to claim the most tiles on a shared grid before time runs out. Built with a focus on real-time responsiveness and clean, modern aesthetics, it challenges users to click faster and smarter than their opponents.

[**🔴 Play Live Demo**](https://taptiles-frontend.vercel.app/) *(Hosted on Vercel & AWS)*

---

## ✨ Features

### 🕹️ Gameplay & Mechanics
-   **Real-Time Multiplayer:** See opponents' moves instantly as they happen.
-   **Dynamic Grid System:** Tiles change color immediately upon claiming.
-   **Game Modes:** Create custom lobbies with configurable durations (30s, 1m, 5m).
-   **Auto-Win Condition:** The game ends instantly if all tiles are claimed.
-   **Psychological Loading Screen:** A custom loader designed to keep users engaged while the backend wakes up.

### 📊 Stats & Analytics
-   **Live Leaderboard:** Track your rank, score, and tile dominance in real-time.
-   **Performance Metrics:** View your "Tiles Per Minute" claim rate.
-   **Persistent History:** Game results and player stats are stored permanently in **MongoDB** for future access.

### 🎨 UI/UX Design
-   **Glassmorphism Interface:** Modern, translucent UI components.
-   **Responsive Design:** Fully playable on desktop and mobile devices.
-   **Dark Mode:** Sleek, eye-friendly dark theme by default.

---

## 🛠️ Tech Stack

This project uses a **Decoupled Architecture**, hosting the frontend and backend on separate specialized services for maximum performance.

### **Frontend (Client)**
-   **React 19 + Vite:** For lightning-fast rendering and build times.
-   **TailwindCSS:** For rapid, responsive styling.
-   **Framer Motion:** For smooth animations and transitions.
-   **Socket.IO Client:** For bidirectional real-time communication.
-   **Hosted on:** Vercel

### **Backend (Server)**
-   **Node.js + Express:** Robust API and easy scalable server logic.
-   **Socket.IO:** The engine behind the real-time events.
-   **Redis (Upstash):**
    -   Used as the **main game state store** (in-memory) for ultra-low latency.
    -   **Pub/Sub** for broadcasting huge volumes of updates efficiently.
    -   **Lua Scripting** for atomic operations to prevent race conditions.
-   **MongoDB (Atlas):** secure, persistent storage for user profiles and match history.
-   **BullMQ:** For handling background jobs and queues.
-   **Hosted on:** AWS EC2 (Dockerized)

### **DevOps & Tools**
-   **Docker:** Full containerization of the backend and Redis services.
-   **Caddy:** Automatic HTTPS entry point (Reverse Proxy).
-   **Git:** Version control.

---

## 🏗️ Architecture Highlights

### **Speed vs. Storage Trade-off**
One of the key engineering decisions was to store the **active game state entirely in Redis RAM**.
-   **Advantage:** This allows for sub-millisecond read/write operations, crucial for a game where 10+ players might click 5 times a second.
-   **Trade-off:** High RAM usage per active game.
-   **Solution:** We implemented an async "flush" mechanism. Once a game ends, the final results are written to **MongoDB** for permanent storage, and the Redis keys are expired to free up memory.

### **Optimistic UI Updates**
To make the game feel "instant," the frontend updates the tile color immediately when you click it, without waiting for the server to confirm. If the server rejects the move (e.g., lag, someone else claimed it), the tile reverts. This makes the game feel incredibly snappy even on slower networks.

---

## 🚀 Getting Started (Run Locally)

### Prerequisites
-   Node.js (v18+)
-   Redis (Local or Cloud URL)
-   MongoDB (Local or Cloud URL)

### 1. Clone the Repository
```bash
git clone https://github.com/avi4803/Taptiles-Backend.git
cd Taptiles-Backend
```

### 2. Setup Backend
```bash
cd Backend
npm install
# Create a .env file with:
# PORT=3000
# REDIS_HOST=localhost
# REDIS_PORT=6379
# MONGODB_URI=mongodb://localhost:27017/taptile
npm run dev
```

### 3. Setup Frontend
```bash
cd ../my-project
npm install
npm run dev
```

Visit `http://localhost:5173` and start clicking!

---

## 🤝 Contributing
Contributions are welcome! Please fork the repo and submit a PR for any enhancements.

---

**Built with ❤️ by Avinash Nishad**
