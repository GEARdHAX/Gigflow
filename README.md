# 🚀 GigFlow - Modern Freelance Marketplace

<div align="center">

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)

**A complete freelancing platform where clients post jobs and freelancers bid for opportunities**

[Demo Video](#-demo) • [Live Preview](#-live-demo) • [Features](#-features) • [Installation](#-installation)

</div>

## 📊 Overview

GigFlow is a production-ready freelance marketplace that connects businesses with talented freelancers. Built with modern web technologies, it features real-time notifications, secure authentication, and an intuitive bidding system.

> **"The perfect platform for businesses to find talent and freelancers to find work."**

## ✨ Live Demo

| Platform | URL | Status |
|----------|-----|--------|
| **🌐 Frontend** | [gigflow.vercel.app](https://gigflow.vercel.app) | ![Live](https://img.shields.io/badge/Live-Online-brightgreen) |
| **🔧 Backend API** | [gigflow-api.onrender.com](https://gigflow-api.onrender.com) | ![API](https://img.shields.io/badge/API-Running-blue) |
| **🎥 Demo Video** | [Watch on Loom](https://www.loom.com/share/...) | ![Video](https://img.shields.io/badge/2_Min-Walkthrough-orange) |

## 🎯 Features

### 🏆 Core Functionality
- **👥 Dual Role System**: Users can seamlessly switch between Client and Freelancer roles
- **📝 Job Posting**: Create detailed job listings with budgets in Indian Rupees (₹)
- **💼 Smart Bidding**: Freelancers submit proposals with personalized cover letters
- **🤝 One-Click Hiring**: Clients can hire freelancers with instant notifications
- **🔍 Intelligent Search**: Filter and search through available opportunities

### 🔐 Security & UX
- **JWT Authentication**: Secure login with HttpOnly cookies
- **Role-based Access**: Protected routes and actions
- **Real-time Updates**: Live notifications using Socket.io
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **ATS Scoring**: Automatic bid ranking based on relevance

### ⚡ Advanced Features
- **Atomic Transactions**: Guaranteed data consistency during hiring
- **Auto-Rejection**: All other bids automatically rejected when one is hired
- **Progress Tracking**: View application status in real-time
- **Currency Formatting**: Indian Rupee (₹) formatting with proper localization
- **Edit & Delete**: Full CRUD operations for job postings

## 🏗️ Architecture

```mermaid
graph TB
    A[Client Browser] -->|HTTPS| B[Vercel CDN]
    B -->|API Calls| C[Render Backend]
    C -->|WebSocket| D[Socket.io]
    C -->|Database| E[MongoDB Atlas]
    D -->|Real-time| A
    C -->|Auth| F[JWT Tokens]
    
    subgraph "Frontend Stack"
        G[React 18]
        H[Vite]
        I[Tailwind CSS]
        J[React Router]
    end
    
    subgraph "Backend Stack"
        K[Express.js]
        L[Mongoose ODM]
        M[Bcrypt.js]
        N[Socket.io Server]
    end
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Lucide React Icons
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Real-time**: Socket.io Client

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HttpOnly cookies
- **Security**: Bcrypt.js for password hashing
- **Real-time**: Socket.io Server
- **Validation**: Express Validator

## 📁 Project Structure

```
gigflow/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── context/       # Auth context
│   │   ├── api/          # API service calls
│   │   ├── utils/        # Helper functions
│   │   └── App.jsx       # Main application
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth middleware
│   │   └── utils/        # Utilities
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- MongoDB (Local or Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gigflow.git
   cd gigflow
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Set up Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your backend API URL
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## ⚙️ Environment Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gigflow
JWT_SECRET=your_super_secure_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Gigs (Job Listings)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gigs` | Get all gigs (with search) |
| GET | `/api/gigs/my-gigs` | Get user's posted gigs |
| POST | `/api/gigs` | Create new gig |
| PUT | `/api/gigs/:id` | Update gig |
| DELETE | `/api/gigs/:id` | Delete gig |

### Bids (Proposals)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bids/:gigId` | Get all bids for a gig |
| GET | `/api/bids/my-bids` | Get user's bids |
| POST | `/api/bids` | Create new bid |
| PATCH | `/api/bids/:bidId/hire` | Hire freelancer |

## 🎥 Demo

### Key Flows Demonstrated:
1. **User Registration & Login** - Secure authentication flow
2. **Job Posting** - Create and publish new opportunities
3. **Bidding Process** - Submit and manage proposals
4. **Hiring Workflow** - One-click hiring with real-time notifications
5. **Dashboard Management** - View and manage gigs/bids

[![Watch Demo](https://img.shields.io/badge/📺_Watch_Full_Demo_on_Loom-FF0000?style=for-the-badge&logo=loom)](https://www.loom.com/share/...)

## 🔥 Deployment Guide

### 1. MongoDB Atlas Setup
1. Create free cluster on [MongoDB Atlas](https://cloud.mongodb.com)
2. Whitelist IP `0.0.0.0/0` for external access
3. Get connection string from "Connect" button

### 2. Backend Deployment (Render)
```bash
# Create new Web Service on Render
Service: Web Service
Environment: Node
Build Command: npm install
Start Command: npm start
Environment Variables: Add all from .env
```

### 3. Frontend Deployment (Vercel)
```bash
# Connect GitHub repository to Vercel
Framework: Vite
Root Directory: frontend
Environment Variables: VITE_API_URL (your deployed backend URL)
```

## 📱 Screenshots

| Dashboard | Create Gig | View Proposals |
|-----------|------------|----------------|
| ![Dashboard](https://i.ibb.co/MyzfcDjD/image.png) | ![Create](https://i.ibb.co/VW9CJSm3/image.png) | ![Proposals](https://i.ibb.co/TBHX4whN/image.png) |

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend linting:
```bash
cd frontend
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@GEARdHAX](https://github.com/GEARdHAX)
- LinkedIn: [ADARSH ARYA](https://linkedin.com/in/adarsharya2911)
- Portfolio: [ADARSH ARYA](https://adarsharya.vercel.app)

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MongoDB University](https://learn.mongodb.com)
- [Express.js Guides](https://expressjs.com/en/guide/routing.html)

