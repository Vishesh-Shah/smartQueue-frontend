# SmartQueue Frontend

A modern, responsive React application for digital queue management that eliminates physical waiting lines with an intuitive ticket booking system.

## 🎥 Project Demo Video
[▶️ Watch Demo Video](https://drive.google.com/file/d/12o9gY6HG8ty95Z8edJWnZJrCbF-uyLwt/view?usp=sharing)

## 🔗 Backend Repository
You can find the backend code here:  
👉 https://github.com/Vishesh-Shah/smartQueue-backend

## 🚀 Features

### Customer Features
- **Digital Ticket Booking**: Book tickets for events without physical queuing
- **Real-time Queue Updates**: Track your position in the queue with live updates
- **QR Code Integration**: Generate and scan QR codes for tickets
- **User Authentication**: Secure login and signup system
- **Event Discovery**: Browse available events and their details

### Admin Features
- **Event Management**: Create and manage queue events
- **Queue Control**: Call next customer, mark tickets as done, or skip tickets
- **Real-time Dashboard**: Monitor active tickets and queue status
- **Display Screen**: Public display for current queue status
- **Admin Access Control**: Secure admin authentication and role management

### Super Admin Features
- **Admin Access Requests**: Approve or deny business admin access requests
- **System Overview**: Comprehensive system management capabilities

## 🛠 Tech Stack

- **Frontend Framework**: React 18.2.0
- **Routing**: React Router DOM 6.11.2
- **Styling**: Tailwind CSS 3.3.2
- **Animations**: Framer Motion 10.12.16
- **HTTP Client**: Axios 1.4.0
- **QR Code Generation**: React QR Code 2.0.11
- **Build Tool**: Create React App

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Backend API running on `http://localhost:8081`

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartqueue-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   - Update `src/services/api.js` if your backend runs on a different port
   - Default: `http://localhost:8081`

4. **Start development server**
   ```bash
   npm start
   ```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚦 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (irreversible)

## 🔐 Authentication & Authorization

### User Roles
1. **Customer**: Can book tickets and view queue status
2. **Admin**: Can manage events and control queues
3. **Super Admin**: Can approve admin access requests

### Token Management
- JWT tokens stored in localStorage
- Automatic token attachment to API requests via Axios interceptors
- Protected routes with authentication checks

## 🌐 API Integration

### Base Configuration
```javascript
const API_BASE_URL = 'http://localhost:8081';
```

### Key Endpoints
- `GET /api/events` - Fetch available events
- `POST /api/customer/book-ticket` - Book a ticket
- `GET /api/admin/events` - Admin event management
- `POST /api/admin/call-next/:eventId` - Call next customer
- `POST /api/admin/mark-done/:ticketId` - Mark ticket as completed

## 🎯 User Flows

### Customer Journey
1. **Landing Page** → Sign up/Login
2. **Home Dashboard** → Browse events
3. **Event Details** → Book ticket
4. **Digital Ticket** → QR code and queue position

### Admin Journey
1. **Admin Login** → Dashboard
2. **Create Events** → Set ticket limits
3. **Manage Queue** → Call next, mark done, skip
4. **Display Screen** → Public queue status

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Create a `.env` file for environment-specific configurations:
```
REACT_APP_API_URL=https://your-api-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**SmartQueue** - Revolutionizing queue management with modern web technology 🎫✨