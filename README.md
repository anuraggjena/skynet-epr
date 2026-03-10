# AI-Powered EPR Evaluation System

A full-stack evaluation management platform for aviation training programs.  
The system enables **administrators and instructors to manage trainee evaluations (EPRs - Electronic Progress & Performance Records)** while providing **performance analytics, AI-assisted feedback generation, and role-based dashboards**.

The platform supports three roles:

-   **Admin** – manage instructors, students, and all evaluations
    
-   **Instructor** – create and manage evaluations for assigned students
    
-   **Student** – view their evaluation history and performance analytics
    



# Live Demo

Frontend (Vercel):

https://skynet-epr.vercel.app

Backend API (Render):

https://skynet-epr.onrender.com


Health check endpoint:

https://skynet-epr.onrender.com/health


# System Architecture

```
Frontend (Next.js + React)
        │
        │ REST API
        ▼
Backend (Node.js + Express)
        │
        │ Drizzle ORM
        ▼
PostgreSQL Database

```


# Tech Stack

### Frontend

-   Next.js
    
-   TypeScript
    
-   TailwindCSS
    
-   ShadCN UI
    
-   Recharts (analytics)
    

### Backend

-   Node.js
    
-   Express.js
    
-   TypeScript
    
-   Drizzle ORM
    
-   PostgreSQL
    

### Deployment

-   Vercel (Frontend)
    
-   Render (Backend + PostgreSQL)
    

### AI Integration

-   Llama 3.1 8B Instruct (LLM for evaluation remark generation)
    

# Features

## Role-Based Dashboards

### Admin Dashboard

-   View all students and instructors
    
-   Access evaluation history
    
-   Manage evaluation records
    
-   View analytics and trends
    

### Instructor Dashboard

-   View students they evaluate
    
-   Create new evaluations (EPR) where they are evaluator at
    
-   Edit existing evaluations
    
-   View evaluation history
    

### Student Dashboard

-   View personal evaluation history
    
-   Performance analytics
    
-   Read-only evaluation access
    


# Evaluation System (EPR)

Each evaluation record contains:

-   Evaluation period
    
-   Overall rating
    
-   Technical skills rating
    
-   Non-technical skills rating
    
-   Instructor remarks
    
-   Evaluation status
    

Evaluation statuses include:

```
draft
submitted
archived

```



# Performance Analytics

The system provides visual analytics including:

-   Overall performance score
    
-   Technical skill trends
    
-   Non-technical skill trends
    
-   Historical evaluation timeline
    

Charts are built using **Recharts**.

----------

# AI-Assisted Remarks

Instructors can generate evaluation remarks using an LLM.

The AI analyzes:

-   Overall rating
    
-   Technical skill rating
    
-   Non-technical rating
    
-   Student name
    
-   Training course
    

The model returns a professional evaluation remark that instructors can edit before saving.

# What Is Implemented

This project implements:

### Level 1 Requirements

-   People directory
    
-   Student & instructor profiles
    
-   Evaluation (EPR) creation
    
-   Evaluation editing
    
-   Evaluation listing
    
-   Evaluation detail view
    
-   Status management
    
-   Role-based access
    
-   API endpoints for CRUD operations
    

### Level 2 Enhancements

Implemented Level 2 features:

-   Performance analytics dashboard
    
-   Evaluation trend charts
    
-   AI-assisted evaluation remark generation
    
-   Clean role-based dashboards
    
-   Instructor-specific evaluation filtering
    

----------

# Project Structure

```
project-root
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── db
│   │   ├── schema
│   │   ├── migrations
│   │   └── seed.ts
│   └── server.ts
│
├── frontend
│   ├── app
│   ├── components
│   │    ├── analytics
│   │    ├── epr
│   │    ├── dashboard
│   │    ├── people
│   │
│   └── lib
│
│
└── README.md

```


# Environment Setup

Create a `.env` file in the backend folder.

Example:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
OPENROUTER_API_KEY=your_api_key

```

Frontend `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api

```


# Database Setup

The system uses **PostgreSQL with Drizzle ORM**.

### Generate database schema

`npm run db:generate`

### Run migrations

`npm run db:migrate`

This will create all required tables.

# Seeding the Database

The project includes a seed script that inserts demo data:

-   Admin user
    
-   Instructors
    
-   Students
    
-   Courses
    
-   Enrollments
    
-   Sample EPR records
    

Run:

`npm run seed`

# Running the Backend

Navigate to the backend folder.

Install dependencies:

`npm install`

Start development server:

`npm run dev`

Production start:

`npm run start`

The backend runs on: http://localhost:5000



# Running the Frontend

Navigate to the frontend folder.

Install dependencies:

`npm install`

Start development server:

`npm run dev`

The frontend runs on: http://localhost:3000

# API Endpoints

### People

`GET /api/people`

Retrieve all users.

----------

### Evaluations

`GET /api/epr?personId=`

Retrieve evaluations for a user.

`POST /api/epr`

Create evaluation.

`PATCH /api/epr/:id`

Update evaluation.

----------

### AI Assistance

`POST /api/epr/assist`

Generate evaluation remarks.


# How I Used AI in This Project

AI was used as a development assistant throughout the project.

### Tools Used

-   ChatGPT
    
-   Google Gemini
    

### How AI Helped

AI was used as a **development assistance tool** primarily to speed up implementation and improve code structure during the development process.

AI assisted with:

-   Converting planned features and architecture into **cleaner and more structured code implementations**
    
-   Suggesting **better code organization and refactoring approaches**
    
-   Assisting with **UI layout improvments and components structuring**
    
-   Helping debug certain implementation and debug issues
    
However, all **core ideas, integration logic, feature planning, database interactions, and final implementation decisions were tested and reviewed manually by me** to ensure correctness and alignment with the intended system design.



# Future Improvements

Potential improvements include:

-   Authentication system (JWT / OAuth)
    
-   Instructor performance metrics
    
-   Role-based access middleware
    
-   Student comparison analytics
    
-   Evaluation export (PDF reports)
    
-   Notification system
    
    
# Author

Anurag Jena  
Full-Stack Developer
