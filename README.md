# Winkshine Admin Panel

A modern React-based admin panel for managing the Winkshine Car Washing Service.

## 🚀 Features

- **Modern UI/UX**: Built with Material-UI for a professional look
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Authentication**: Secure login system with JWT tokens
- **Dashboard**: Real-time statistics and analytics
- **User Management**: Complete user CRUD operations
- **Service Management**: Manage car washing services
- **Booking Management**: Handle customer bookings
- **Review Management**: Moderate customer reviews
- **Settings**: Business configuration and preferences

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (winkshineBackend)

## 🛠️ Installation

1. **Navigate to the admin panel directory**
   ```bash
   cd winkshine-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend Connection

Make sure your backend server is running on port 5000:
```bash
cd ../winkshineBackend
npm run dev
```

## 📱 Pages & Features

### 🔐 Authentication
- **Login Page**: Secure admin authentication
- **Protected Routes**: Automatic redirect to login if not authenticated
- **Token Management**: JWT token storage and validation

### 📊 Dashboard
- **Statistics Cards**: Total users, bookings, revenue, etc.
- **Recent Bookings**: Latest booking activities
- **Quick Actions**: Fast access to common tasks

### 👥 User Management
- **User List**: View all registered users
- **User Details**: Individual user information
- **Status Management**: Activate/deactivate users
- **Role Management**: Assign admin/user roles

### 🚗 Service Management
- **Service List**: View all car washing services
- **Add/Edit Services**: Create and modify services
- **Pricing Management**: Set service prices
- **Category Management**: Organize services by type

### 📅 Booking Management
- **Booking List**: View all customer bookings
- **Status Updates**: Change booking status
- **Filtering**: Filter by date, status, customer
- **Today's Bookings**: Quick view of today's schedule

### ⭐ Review Management
- **Review List**: View all customer reviews
- **Moderation**: Approve/hide inappropriate reviews
- **Rating Analysis**: Customer satisfaction metrics

### ⚙️ Settings
- **Business Hours**: Set operating hours
- **Pricing Configuration**: Tax rates, discounts
- **Notification Settings**: Email/SMS preferences
- **General Info**: Business details

## 🎨 UI Components

### Layout
- **Sidebar Navigation**: Easy navigation between sections
- **Header**: User profile and notifications
- **Responsive Design**: Mobile-friendly interface

### Data Display
- **Data Tables**: Sortable and filterable tables
- **Cards**: Statistics and information cards
- **Charts**: Visual data representation
- **Forms**: User-friendly input forms

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Route-level security
- **API Interceptors**: Automatic token handling
- **Error Handling**: Graceful error management

## 🚀 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Layout components
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Dashboard page
│   ├── Users/          # User management
│   ├── Services/       # Service management
│   ├── Bookings/       # Booking management
│   ├── Reviews/        # Review management
│   └── Settings/       # Settings page
├── services/           # API service functions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## 🔌 API Integration

The admin panel connects to the Winkshine backend API:

- **Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT token in Authorization header
- **Error Handling**: Automatic token refresh and logout
- **Data Fetching**: React Query for efficient data management

## 🎯 Demo Credentials

For testing purposes:
- **Email**: admin@winkshine.com
- **Password**: admin123

## 🛠️ Development

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/components/Layout/Sidebar.tsx`

### Styling
- Use Material-UI components and theme
- Follow the established color scheme
- Maintain responsive design principles

### API Integration
- Add new API functions in `src/services/api.ts`
- Use React Query for data fetching
- Handle loading and error states

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🆘 Support

For support, contact the development team or create an issue in the repository. 