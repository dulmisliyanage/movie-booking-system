# 🌌 CINEVERSE | Premium Movie Booking System

CINEVERSE is a full-stack MERN (MongoDB, Express, React, Node.js) application designed with a high-end, cinematic aesthetic. It provides a seamless experience for movie enthusiasts to browse current and upcoming blockbusters and book their favorite seats in real-time.

## ✨ Key Features

- **🎬 Smart Categorization**: Movies are automatically split into "Now Showing" and "Coming Soon" based on their release dates.
- **🏮 Cinematic UI**: A premium dark-theme interface built with Tailwind CSS, featuring high-contrast typography (Bebas Neue) and smooth transitions.
- **🛋️ Real-time Booking**: Interactive seat selection grid with price calculation and instant confirmation.
- **🛡️ Admin Dashboard**: Comprehensive management panel for movies, showtimes, and booking statistics.
- **👣 Compact Footer**: A sleek, full-width footer for professional site-wide navigation.
- **🔐 Secure Auth**: Role-based access control (Admin/User) with JWT authentication.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **State/Auth**: LocalStorage & Protected Routes

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>

# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create a `.env` file in the `/server` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000
```

### 3. Run the Application

```bash
# Start Backend (from /server)
npm run dev

# Start Frontend (from /client)
npm run dev
```

## 🎥 Screenshots

*(Add your screenshots here)*

## 📄 License

This project is open-source and available under the MIT License.

---
**CINEVERSE** - *Step Into The Spotlight* ✦
