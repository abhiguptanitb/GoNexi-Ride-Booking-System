# 🚗 Uber Clone

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-Maps-000000?style=for-the-badge&logo=mapbox&logoColor=white)

**A full-stack ride-sharing application clone built with modern web technologies**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

This is a comprehensive **Uber Clone** application that replicates the core functionality of a ride-sharing platform. The project features separate interfaces for **users** (riders) and **captains** (drivers), real-time location tracking, ride booking, fare calculation, and seamless communication between users and drivers using WebSocket technology.

### Key Highlights

- 🔐 **Dual Authentication System** - Separate login/registration for users and captains
- 📍 **Real-time Location Tracking** - Live GPS tracking using Mapbox
- 🚕 **Smart Ride Matching** - Geospatial queries to find nearby drivers
- 💬 **Real-time Communication** - Socket.io for instant updates
- 💰 **Dynamic Fare Calculation** - Distance and time-based pricing
- 🎨 **Modern UI/UX** - Built with React, Tailwind CSS, and GSAP animations

---

## ✨ Features

### 👤 User Features
- ✅ User registration and authentication
- ✅ Profile management
- ✅ Interactive map with location search
- ✅ Ride booking with vehicle type selection
- ✅ Real-time driver tracking
- ✅ Ride confirmation and status updates
- ✅ Fare calculation before booking
- ✅ Ride history

### 🚖 Captain (Driver) Features
- ✅ Captain registration and authentication
- ✅ Vehicle information management
- ✅ Real-time location sharing
- ✅ Receive ride requests
- ✅ Accept/decline ride requests
- ✅ Navigate to pickup and destination
- ✅ Start and end ride functionality
- ✅ Earnings tracking

### 🔄 Real-time Features
- ✅ Live location updates
- ✅ Instant ride request notifications
- ✅ Real-time ride status updates
- ✅ WebSocket-based communication
- ✅ Geospatial driver matching (within 10km radius)

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication tokens |
| **Socket.io** | Real-time bidirectional communication |
| **Mapbox SDK** | Geocoding, routing, and distance calculation |
| **Bcrypt** | Password hashing |
| **Express Validator** | Input validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Mapbox GL** | Interactive maps |
| **Socket.io Client** | Real-time communication |
| **GSAP** | Animation library |
| **Axios** | HTTP client |
| **React Router** | Client-side routing |

---

## 📁 Project Structure

```
uber-clone/
│
├── Backend/
│   ├── controllers/          # Route controllers
│   │   ├── user.controller.js
│   │   ├── captain.controller.js
│   │   ├── ride.controller.js
│   │   └── map.controller.js
│   ├── models/               # MongoDB models
│   │   ├── user.model.js
│   │   ├── captain.model.js
│   │   ├── ride.model.js
│   │   └── blacklistToken.model.js
│   ├── routes/               # API routes
│   │   ├── user.routes.js
│   │   ├── captain.routes.js
│   │   ├── ride.routes.js
│   │   └── maps.routes.js
│   ├── services/             # Business logic
│   │   ├── user.service.js
│   │   ├── captain.service.js
│   │   ├── ride.service.js
│   │   └── maps.service.js
│   ├── middlewares/          # Custom middlewares
│   │   └── auth.middleware.js
│   ├── db/                   # Database connection
│   │   └── db.js
│   ├── socket.js             # Socket.io configuration
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
│
└── Frontend/
    ├── src/
    │   ├── components/       # React components
    │   │   ├── ConfirmRide.jsx
    │   │   ├── LookingForDriver.jsx
    │   │   ├── LiveTracking.jsx
    │   │   ├── VehiclePanel.jsx
    │   │   └── ...
    │   ├── pages/            # Page components
    │   │   ├── Home.jsx
    │   │   ├── UserLogin.jsx
    │   │   ├── CaptainHome.jsx
    │   │   └── ...
    │   ├── context/          # React Context providers
    │   │   ├── UserContext.jsx
    │   │   ├── CaptainContext.jsx
    │   │   └── SocketContext.jsx
    │   ├── hooks/            # Custom React hooks
    │   └── App.jsx           # Main app component
    └── public/               # Static assets
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Mapbox Account** (for API access)

### Step 1: Clone the Repository

```bash
git clone https://github.com/abhiguptanitb/GoNexi-Ride-Booking-System.git
cd uber-clone
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file
touch .env
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd Frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `Backend` directory:

```env
# Database
DB_CONNECT=mongodb://localhost:27017/uber-clone
# or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/uber-clone

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Mapbox API
MAPBOX_ACCESS_TOKEN=your_mapbox_access_token

# Server Port
PORT=3000
```

### Frontend Environment Variables

Create a `.env` file in the `Frontend` directory:

```env
# Backend API URL
VITE_BASE_URL=http://localhost:3000

# Mapbox Access Token
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

### Getting Mapbox Access Token

1. Sign up at [Mapbox](https://www.mapbox.com/)
2. Go to your [Account page](https://account.mapbox.com/)
3. Copy your **Default public token**
4. Add it to both `.env` files

---

## 💻 Usage

### Start Backend Server

```bash
cd Backend
npm start
```

The backend server will run on `http://localhost:3000`

### Start Frontend Development Server

```bash
cd Frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Access the Application

1. Open your browser and navigate to `http://localhost:5173`
2. **For Users**: Register/Login and start booking rides
3. **For Captains**: Register/Login with vehicle details and start accepting rides

---

## 📚 API Documentation

### 🔐 Authentication Endpoints

#### User Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/users/register` | Register a new user | ❌ |
| `POST` | `/users/login` | Login user | ❌ |
| `GET` | `/users/profile` | Get user profile | ✅ |
| `GET` | `/users/logout` | Logout user | ✅ |

#### Captain Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/captains/register` | Register a new captain | ❌ |
| `POST` | `/captains/login` | Login captain | ❌ |
| `GET` | `/captains/profile` | Get captain profile | ✅ |
| `GET` | `/captains/logout` | Logout captain | ✅ |
| `GET` | `/captains/:captainId/vehicle/vehicleType` | Get vehicle type | ✅ |

### 🚕 Ride Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/rides/create` | Create a new ride request | ✅ (User) |
| `GET` | `/rides/get-fare` | Calculate ride fare | ✅ (User) |
| `POST` | `/rides/confirm` | Confirm ride acceptance | ✅ (Captain) |
| `GET` | `/rides/start-ride` | Start an active ride | ✅ (Captain) |
| `POST` | `/rides/end-ride` | End and complete ride | ✅ (Captain) |

### 🗺 Map Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/maps/get-coordinates` | Get coordinates for address | ✅ |
| `GET` | `/maps/get-distance-time` | Get distance and time | ✅ |
| `GET` | `/maps/get-suggestions` | Get address autocomplete | ✅ |

### Example API Request

```javascript
// Create a ride
const response = await fetch('http://localhost:3000/rides/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    pickup: "123 Main St, City",
    destination: "456 Oak Ave, City",
    vehicleType: "sedan"
  })
});
```

---


## 🔧 How It Works

### Ride Booking Flow

1. **User selects pickup and destination** → Mapbox geocoding converts addresses to coordinates
2. **System calculates fare** → Based on distance and time using Mapbox API
3. **Find nearby drivers** → MongoDB geospatial query finds captains within 10km radius
4. **Send ride request** → Socket.io broadcasts to matching drivers
5. **Driver accepts** → Real-time notification sent to user
6. **Live tracking** → Both user and driver see each other's location
7. **Ride completion** → Driver ends ride, fare is finalized

### Real-time Communication

- **WebSocket Connection**: Socket.io enables bidirectional communication
- **Room-based System**: Users and captains join specific rooms
- **Event-driven Updates**: Real-time location and status updates

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@abhiguptanitb](https://github.com/abhiguptanitb)
- LinkedIn: [abhiguptanitb](https://linkedin.com/in/abhiguptanitb)

---

## 🙏 Acknowledgments

- [Uber](https://www.uber.com/) for the design inspiration
- [Mapbox](https://www.mapbox.com/) for mapping services
- [Socket.io](https://socket.io/) for real-time communication
- All open-source contributors

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ using React, Node.js, and MongoDB

</div>
