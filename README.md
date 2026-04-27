# 🎮 Gaming Stats Tracker

A full-stack web application that tracks and visualizes gaming data including player activity, scores, game sessions, and analytics.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular (latest) + Angular Material |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Charts | Chart.js |
| Bonus | Apache Kafka / Apache Spark |

---

## 📁 Project Structure

```
gaming-stats-tracker/
│
├── backend/
│   ├── config/          # DB config, env setup
│   ├── models/          # Mongoose schemas (Player, Session, Score)
│   ├── routes/          # Express routes
│   ├── controllers/     # Route handler logic
│   ├── scripts/         # Data seeding scripts
│   └── server.js        # Entry point
│
├── frontend/
│   └── src/app/
│       ├── components/  # Reusable UI components
│       ├── services/    # Angular HTTP services
│       └── pages/       # Dashboard, Players, Details
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- Angular CLI (`npm install -g @angular/cli`)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
ng serve
```

---

## 📊 Features

- 🏆 Track players, scores, and game sessions
- 📈 Line chart: scores over time
- 📊 Bar chart: top players leaderboard
- 🥧 Pie chart: activity distribution
- 🔌 RESTful API with Express
- 🌱 Seed script to generate thousands of fake records

---

## 🪜 Build Steps (Progress)

- [x] Step 1: Environment Setup & GitHub Repo
- [ ] Step 2: Backend Initialization
- [ ] Step 3: Database Design (Mongoose Schemas)
- [ ] Step 4: API Development
- [ ] Step 5: Data Simulation Script
- [ ] Step 6: Angular Frontend Setup
- [ ] Step 7: Frontend Pages & Components
- [ ] Step 8: Charts & Visualizations
- [ ] Step 9: Connect Frontend & Backend
- [ ] Step 10: Bonus (Kafka / Spark)

---

 Author

**Ahmed Aziz Dimassi** — 2nd year Big Data student at EPI



