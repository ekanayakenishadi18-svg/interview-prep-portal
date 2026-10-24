# Interview Prep Portal (MERN)

A full-stack web application that helps students prepare for technical and HR interviews. Users practice from a question bank with model answers, take timed multiple-choice quizzes that are graded automatically, track their progress, and read or share interview experiences. Admins manage the content and users.

Built with **MongoDB, Express.js, React (Vite) and Node.js**.

## Features

**Students (role: user)**
- Register, log in and stay logged in (JWT authentication, passwords hashed with bcrypt)
- Question bank across 8 topics: DSA, OOP, DBMS, OS, Networks, Web Development, System Design, HR & Behavioral
- Search and filter by topic, difficulty and status (practiced / not practiced / bookmarked), with pagination
- Write your own answer first, then reveal the model answer
- Mark questions as practiced and bookmark them
- Timed MCQ quizzes with a countdown, question navigator and auto-submit when time runs out
- Instant results with the correct answer and explanation for every question
- Quiz history and best score per quiz
- Dashboard with progress per topic, average and best scores, and recent results
- Interview experiences: share, edit and delete your own posts; search, filter by outcome, sort by most helpful; mark posts as helpful
- Profile page: update details and change password

**Admins (role: admin)**
- Overview of users, questions, quizzes, attempts and posts
- Create, edit and delete questions
- Quiz builder: add questions and options, pick the correct answer, add explanations, set time limit, publish or keep as draft
- Manage users: change roles, delete accounts (also removes their results and posts)
- Delete any interview experience post

**Security and data integrity**
- Correct answers are never sent to the browser while a quiz is being taken; grading happens on the server
- Role-based route protection on both server (middleware) and client (protected routes)
- Users can only edit their own posts and view their own results
- Quiz results are stored as snapshots, so editing or deleting a quiz doesn't break past results
- Centralised error handling with clear messages for validation, duplicate and invalid-ID errors

## Tech stack

| Layer | Technology |
| --- | --- |
| Front end | React 18, React Router 6, Axios, react-hot-toast, Vite |
| Back end | Node.js, Express 4 |
| Database | MongoDB with Mongoose 8 |
| Auth | JSON Web Tokens, bcryptjs |

## Folder structure

```
interview-prep-portal/
├── package.json              # root scripts (run client + server together)
├── server/
│   ├── server.js             # Express app entry point
│   ├── config/db.js          # MongoDB connection
│   ├── models/               # User, Question, Quiz, Attempt, Experience
│   ├── controllers/          # route logic
│   ├── routes/               # API route definitions
│   ├── middleware/           # auth (protect, adminOnly), error handler
│   ├── utils/                # constants, helpers, token generation
│   └── seed/                 # sample data + seed script
└── client/
    ├── index.html
    ├── vite.config.js        # dev proxy: /api -> http://localhost:5000
    └── src/
        ├── api/client.js     # Axios instance with JWT interceptor
        ├── context/          # AuthContext
        ├── hooks/            # useDebounce, useQuestionActions
        ├── components/       # Navbar, QuestionCard, ProtectedRoute, ...
        ├── pages/            # user pages
        │   └── admin/        # admin pages
        ├── utils/            # constants, formatting
        └── index.css         # all styles
```

## Getting started

### Prerequisites
- Node.js 18 or later
- MongoDB running locally (Community Server or Docker) **or** a free MongoDB Atlas cluster

### 1. Install dependencies
```bash
cd interview-prep-portal
npm run install-all
```
(This installs the root, server and client packages. You can also run `npm install` inside `server/` and `client/` separately.)

### 2. Configure environment variables
```bash
cd server
cp .env.example .env      # on Windows: copy .env.example .env
```
Edit `server/.env`:
- `MONGO_URI` – your local URI or Atlas connection string
- `JWT_SECRET` – any long random string

### 3. Load sample data
```bash
npm run seed              # from the project root
```
This creates 28 questions, 4 quizzes, 3 interview experiences and these accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@prep.dev | Admin@123 |
| Student | student@prep.dev | Student@123 |
| Student | kavindi@prep.dev | Student@123 |

### 4. Run the app
```bash
npm run dev               # from the project root
```
- Client: http://localhost:5173
- API: http://localhost:5000/api (health check at `/api/health`)

To run them separately: `npm run dev` inside `server/`, and `npm run dev` inside `client/`.

### Production build
```bash
npm run build                         # builds client/dist
cd server && NODE_ENV=production npm start
```
In production the Express server also serves the built React app.

## API reference

All routes except register and login need the header `Authorization: Bearer <token>`.

### Auth – `/api/auth`
| Method | Route | Description |
| --- | --- | --- |
| POST | `/register` | Create an account |
| POST | `/login` | Log in, returns token and user |
| GET | `/me` | Current user |
| PUT | `/profile` | Update name, target role, bio |
| PUT | `/password` | Change password |

### Questions – `/api/questions`
| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/` | User | List with `category`, `difficulty`, `search`, `status`, `page`, `limit` |
| GET | `/bookmarks` | User | Bookmarked questions |
| GET | `/:id` | User | One question with model answer |
| POST | `/:id/bookmark` | User | Toggle bookmark |
| POST | `/:id/practice` | User | Toggle practiced |
| POST | `/` | Admin | Create |
| PUT | `/:id` | Admin | Update |
| DELETE | `/:id` | Admin | Delete |

### Quizzes – `/api/quizzes`
| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/` | User | Published quizzes with your best score |
| GET | `/:id` | User | Quiz questions without answers |
| POST | `/:id/submit` | User | Submit `{ answers, timeTaken }`, returns `attemptId` |
| GET | `/attempts/me` | User | Your results |
| GET | `/attempts/:attemptId` | Owner/Admin | Full result with review |
| GET | `/admin/all` | Admin | All quizzes incl. drafts |
| GET | `/:id/full` | Admin | Quiz including answers (for editing) |
| POST | `/` | Admin | Create |
| PUT | `/:id` | Admin | Update |
| DELETE | `/:id` | Admin | Delete |

### Experiences – `/api/experiences`
| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/` | User | List with `search`, `outcome`, `sort`, `mine`, `page` |
| GET | `/:id` | User | One post |
| POST | `/` | User | Create |
| PUT | `/:id` | Author | Update |
| DELETE | `/:id` | Author/Admin | Delete |
| POST | `/:id/like` | User | Toggle "helpful" |

### Users – `/api/users`
| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/dashboard` | User | Progress summary |
| GET | `/admin/stats` | Admin | Platform counts |
| GET | `/` | Admin | List users |
| PUT | `/:id/role` | Admin | Change role |
| DELETE | `/:id` | Admin | Delete user and their data |

## Data model

- **User** – name, email, hashed password, role, target role, bio, bookmarks[], practiced[]
- **Question** – title, answer, category, difficulty, tags[], company, createdBy
- **Quiz** – title, description, category, difficulty, timeLimit, isPublished, questions[{ question, options[], correctIndex, explanation }]
- **Attempt** – user, quiz, quizTitle, responses[] (snapshot), score, total, percentage, timeTaken
- **Experience** – company, role, location, outcome, difficulty, rounds, content, tips, author, likes[], likeCount

## Ideas for extending the project
- Email verification and password reset
- Upload a CV and get role-specific question suggestions
- Spaced repetition scheduling for practiced questions
- Comments on interview experiences
- Unit tests with Jest and Supertest
