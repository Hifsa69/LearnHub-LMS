# R# LearnHub LMS — Learning Management System

A web-based Learning Management System (LMS) developed to provide a platform for students to explore courses, create accounts, and access learning resources. The project uses the MERN stack and REST APIs for communication between the frontend and backend.

## Project Overview

LearnHub LMS is designed to simplify online learning by organizing courses and providing user authentication. It demonstrates full-stack web development concepts, database integration, and API development.

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Role-based access for students, instructors, and administrators
- Course listing and course details
- Course creation, updating, and deletion endpoints with role-based authorization
- Student enrollment endpoints
- MongoDB database integration
- REST API testing using Postman
- React-based user interface

*Note: The availability and successful operation of individual features depend on their implementation and testing in the current project.*

## Technology Stack

**Frontend**
- React.js
- React Router
- Axios
- Bootstrap

**Backend**
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- bcryptjs

**Database**
- MongoDB
- Mongoose

**Development and Testing Tools**
- Visual Studio Code
- Postman
- Git and GitHub

## Project Structure


LearnHub/
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md

*The folder structure may vary depending on the final project files.*

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB or a MongoDB Atlas database
- Git
- Postman (for API testing)

## Installation and Setup

### 1. Clone the Repository


git clone https://github.com/YOUR-USERNAME/LearnHub-LMS.git
cd LearnHub-LMS


### 2. Set Up the Backend


cd backend
npm install

Create a `.env` file in the backend folder and configure the required environment variables:


MONGODB_USERNAME="hifsabashir697_db_user"
MONGODB_PASSWORD="LearnHub2026"
MONGODB_URI="mongodb+srv://hifsabashir697_db_user:LearnHub2026@cluster0.lfxdpfn.mongodb.net/LearnHub"
PORT=5000
JWT_SECRET=LEARNHUBPROJECT-HIFSABASHIR679


Use the exact MongoDB variable name expected by your database configuration file. Keep your actual credentials private and never commit `.env` to GitHub.

Start the backend:

npm start


If the project does not define a start script, use:


node server.js


The backend is expected to run at:

`http://localhost:5000`

### 3. Set Up the Frontend

Open another terminal:

cd frontend
npm install
npm start
```

If the frontend uses Vite, run:


npm run dev

Use the local URL printed by the frontend development server.

## API Endpoints

The following endpoints are based on the backend route configuration.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Check backend availability |
| POST | `/register` | Register a student account |
| POST | `/login` | Authenticate a user |
| GET | `/courses` | Retrieve available courses |
| GET | `/courses/:id` | Retrieve a specific course |
| POST | `/courses` | Create a course (instructor/admin authorization required) |
| PUT | `/courses/:id` | Update a course (instructor/admin authorization required) |
| DELETE | `/courses/:id` | Delete a course (instructor/admin authorization required) |
| POST | `/enroll` | Enroll in a course, if configured at this path |
| GET | `/my-courses` | Retrieve enrolled courses, if configured at this path |

Protected endpoints require a valid JWT in the Authorization header:

Authorization: Bearer YOUR_JWT_TOKEN

The exact enrollment routes and request formats depend on the enrollment route implementation.

## Testing

The backend APIs were tested using Postman.

Verified during testing:
- Backend health check
- Student login and JWT token generation
- Course retrieval
- Registration and duplicate email handling

Course update, course deletion, and enrollment endpoints require confirmed test results before they can be reported as successfully tested.

## Security

- Passwords are hashed before storage.
- JWT is used for authentication.
- Protected course operations use role-based authorization.
- Database credentials and JWT secrets must be stored in environment variables.
- The `.env` file must not be uploaded to the public repository.

## Future Improvements

- Add lesson management and course completion features
- Improve frontend validation and error handling
- Deploy the application for public access

## Author

**Hifsa Bashir**

## License

This project was developed for educational and academic purposes.

