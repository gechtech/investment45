# EthioInvest Network

A full-stack investment platform built for Ethiopian users, offering daily ROI returns and a comprehensive referral system.

## Features

### User Features
- **Registration & Authentication**: Secure JWT-based authentication with referral support
- **Investment Plans**: 10 investment tiers (V1-V10) with 20% daily ROI for 65 days
- **Bank Integration**: Ethiopian bank transfer support with FT ID submission
- **Referral System**: 3-level referral commissions (10%, 5%, 2%)
- **Task System**: Gamified tasks with rewards
- **Dashboard**: Comprehensive wallet and earnings tracking
- **Mobile-First Design**: Responsive interface with bottom navigation

### Admin Features
- **Admin Dashboard**: Complete platform statistics and analytics
- **Investment Management**: Review and approve/reject investment submissions
- **User Management**: Full user account management and monitoring
- **ROI Automation**: Automated daily ROI distribution system
- **Referral Tracking**: Monitor and manage referral commissions

### Technical Features
- **Frontend**: React 18 with TypeScript, Tailwind CSS, React Router
- **Backend**: Node.js/Express with MongoDB, JWT authentication
- **File Upload**: Secure image upload with validation (2MB limit, JPG/PNG)
- **Real-time Updates**: Live dashboard updates and notifications
- **Responsive Design**: Mobile-first approach with touch-friendly interface

## Investment Plans

| Plan | Amount (ETB) | Daily ROI | Total Return (65 days) |
|------|-------------|-----------|------------------------|
| V1   | 500         | 100       | 6,500                 |
| V2   | 1,000       | 200       | 13,000                |
| V3   | 1,500       | 300       | 19,500                |
| V4   | 2,500       | 500       | 32,500                |
| V5   | 4,000       | 800       | 52,000                |
| V6   | 8,000       | 1,600     | 104,000               |
| V7   | 15,000      | 3,000     | 195,000               |
| V8   | 50,000      | 10,000    | 650,000               |
| V9   | 100,000     | 20,000    | 1,300,000             |
| V10  | 200,000     | 40,000    | 2,600,000             |

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ethio-invest-network
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ethio-invest

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=5000

# Cloudinary (optional, for cloud file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/password` - Update password

### Investments
- `POST /api/investments/submit` - Submit investment
- `GET /api/investments/user` - Get user investments
- `POST /api/investments/approve/:id` - Approve investment (admin)
- `POST /api/investments/reject/:id` - Reject investment (admin)

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/submissions` - Get investment submissions
- `GET /api/admin/users` - Get users list

### Referrals
- `GET /api/referrals/team` - Get referral team data

### Tasks
- `GET /api/tasks/user` - Get user tasks
- `POST /api/tasks/complete/:id` - Complete task

## Database Models

### User
- Personal information (name, email, phone)
- Wallet balance and earnings
- Referral code and relationships
- Admin status

### Investment
- Investment details and progress
- ROI calculations and payments
- Active status and duration

### InvestmentSubmission
- FT ID and screenshot
- Admin review status
- Approval/rejection details

### Referral
- Multi-level referral tracking
- Commission calculations
- Payment history

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- File upload validation
- Input sanitization
- Admin role protection
- Rate limiting (recommended for production)

## Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set up production environment**
   - Configure MongoDB connection
   - Set up file upload storage
   - Configure environment variables

3. **Deploy to your preferred platform**
   - Vercel, Netlify (frontend)
   - Heroku, DigitalOcean (backend)
   - MongoDB Atlas (database)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, contact the development team or create an issue in the repository.