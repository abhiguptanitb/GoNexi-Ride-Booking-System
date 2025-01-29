# Uber Clone

This project is a clone of the Uber application, built with a Node.js backend and a React frontend. It includes features such as user and captain authentication, ride booking, real-time location tracking, and more. It also implements direct communication between users and captains using Socket.io.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User and Captain Authentication
- Ride Booking
- Real-time Location Tracking
- Fare Calculation
- Ride Confirmation and Completion
- Direct Communication between Users and Captains

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Socket.io for real-time communication
- Mapbox API for location services

### Frontend

- React
- Vite
- Tailwind CSS
- Axios for API requests
- Socket.io-client for real-time communication
- Mapbox GL for maps

## Installation

### Backend

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/uber-clone.git
    cd uber-clone/Backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the `Backend` directory and add the following environment variables:
    ```env
    DB_CONNECT=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
    PORT=3000
    ```

4. Start the backend server:
    ```sh
    npm start
    ```

### Frontend

1. Navigate to the `Frontend` directory:
    ```sh
    cd ../Frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the `Frontend` directory and add the following environment variables:
    ```env
    VITE_BASE_URL=http://localhost:3000
    VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
    ```

4. Start the frontend development server:
    ```sh
    npm run dev
    ```

## Usage

1. Open your browser and navigate to [http://localhost:5173](http://_vscodecontentref_/1) to access the frontend.
2. Use the application to register as a user or captain, book rides, and track locations in real-time.

## API Endpoints

### User Routes

- `POST /users/register` - Register a new user
- `POST /users/login` - Login a user
- `GET /users/profile` - Get user profile
- `GET /users/logout` - Logout a user

### Captain Routes

- `POST /captains/register` - Register a new captain
- `POST /captains/login` - Login a captain
- `GET /captains/profile` - Get captain profile
- `GET /captains/logout` - Logout a captain
- `GET /captains/:captainId/vehicle/vehicleType` - Get captain's vehicle type

### Ride Routes

- `POST /rides/create` - Create a new ride
- `GET /rides/get-fare` - Get fare for a ride
- `POST /rides/confirm` - Confirm a ride
- `GET /rides/start-ride` - Start a ride
- `POST /rides/end-ride` - End a ride

### Map Routes

- `GET /maps/get-coordinates` - Get coordinates for an address
- `GET /maps/get-distance-time` - Get distance and time between two locations
- `GET /maps/get-suggestions` - Get autocomplete suggestions for an address

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
