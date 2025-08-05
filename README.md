# Winkshine Admin Panel

A modern React-based admin panel for managing the Winkshine Car Wash Service. This is the frontend application that connects to the Winkshine Admin API.

## Features

- 🔐 JWT Authentication with API
- 👥 User Management (Admin/User roles)
- 📊 Dashboard with Analytics
- 🎨 Material-UI Components
- 📝 TypeScript Support
- 🛡️ Security Features

## Prerequisites

1. **Node.js** - Version 16 or higher
2. **Winkshine Admin API** - Backend API server running
3. **npm** or **yarn**

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Backend API:**
   Make sure the Winkshine Admin API is running on port 5000:
   ```bash
   cd ../winkshine-admin-api
   npm install
   npm run dev
   ```

3. **Start the Frontend:**
   ```bash
   npm start
   ```

## Default Login Credentials

After the backend API is initialized, you can login with:

- **Email**: `admin@winkshine.com`
- **Password**: `admin123`

## Project Structure

```
src/
├── components/
│   └── Layout/           # Layout components
├── pages/
│   ├── Auth/             # Authentication pages
│   └── Dashboard/        # Dashboard pages
├── services/
│   └── api.ts            # API service for backend communication
└── types/
    └── index.ts          # TypeScript type definitions
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## API Integration

The frontend connects to the backend API using:
- **Base URL**: `http://localhost:5000/api` (configurable via `REACT_APP_API_URL`)
- **Authentication**: JWT token in Authorization header
- **Error Handling**: Automatic token refresh and logout

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Development

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update types in `src/types/index.ts`
4. Add API functions in `src/services/api.ts`

### API Communication
- All API calls go through `src/services/api.ts`
- JWT tokens are automatically handled
- Error handling is centralized

## Production Deployment

1. Set `REACT_APP_API_URL` to your production API URL
2. Build the application: `npm run build`
3. Serve the build folder

## Troubleshooting

### API Connection Issues
1. Ensure the backend API is running on port 5000
2. Check the `REACT_APP_API_URL` environment variable
3. Verify CORS is configured on the backend

### Authentication Issues
1. Ensure the backend API is initialized with default admin user
2. Check if the user exists and is active
3. Verify email and password are correct

### Build Issues
1. Install dependencies: `npm install`
2. Check TypeScript errors: `npm run build`
3. Clear node_modules and reinstall if needed

## Related Projects

- **winkshine-admin-api**: Backend API server with MongoDB integration 