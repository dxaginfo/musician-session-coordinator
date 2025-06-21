# Musician Session Coordinator

A web application for matching session musicians with recording needs, managing scheduling and payments.

## Overview

The Session Musician Coordinator is designed to connect recording studios, producers, and artists with session musicians based on instrument expertise, genre experience, availability, and budget. It streamlines the process of finding, booking, and paying session musicians for recording projects.

## Features

- **User Registration and Profiles**
  - Musician profiles with instruments, skills, and audio samples
  - Producer/studio profiles with project history and preferences
  - Availability calendar management

- **Project Management**
  - Create recording projects with detailed requirements
  - Invite specific musicians to projects
  - View and accept/decline project invitations

- **Matching System**
  - Search for available musicians based on criteria
  - Receive notifications about matching projects
  - View ratings and reviews of potential collaborators

- **Scheduling**
  - Schedule recording sessions on an integrated calendar
  - Confirm availability for specific time slots
  - Receive reminders about upcoming sessions

- **Payment Processing**
  - Set and agree on rates with musicians
  - Secure payment processing for completed work
  - Payment history and invoice generation

- **Communication**
  - In-app messaging between users
  - Share session details and files
  - Provide feedback on contributions

- **Reviews and Ratings**
  - Rate and review users after collaborations
  - Build reputation based on successful projects

## Technology Stack

### Frontend
- React.js with TypeScript
- Redux for state management
- Material-UI for responsive design
- FullCalendar for scheduling interface
- Howler.js for audio playback

### Backend
- Node.js with Express
- RESTful API with JWT authentication
- Socket.io for real-time messaging

### Database
- PostgreSQL for relational data
- Knex.js for migrations
- Objection.js ORM

### Storage
- AWS S3 for audio samples and profile media
- Cloudfront for CDN

### DevOps
- Docker for containerization
- GitHub Actions for CI/CD
- AWS Elastic Beanstalk for hosting

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v13 or higher)
- Docker (optional, for containerized development)

### Setup
1. Clone the repository
   ```bash
   git clone https://github.com/dxaginfo/musician-session-coordinator.git
   cd musician-session-coordinator
   ```

2. Install dependencies
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables
   ```bash
   # Create .env files from examples
   cp .env.example .env
   ```

4. Set up the database
   ```bash
   cd server
   npm run migrate
   npm run seed
   ```

5. Start the development server
   ```bash
   # Start backend
   cd server
   npm run dev

   # Start frontend (in another terminal)
   cd client
   npm start
   ```

6. The application will be available at `http://localhost:3000`

## Docker Setup

1. Build and run with Docker Compose
   ```bash
   docker-compose up --build
   ```

2. The application will be available at `http://localhost:3000`

## Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Prepare backend for production
cd ../server
npm run build
```

### Deploy to AWS Elastic Beanstalk
Detailed deployment instructions are available in the [deployment guide](docs/deployment.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/dxaginfo/musician-session-coordinator](https://github.com/dxaginfo/musician-session-coordinator)