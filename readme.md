# Expense Tracker

## Deployed URL

[Expense Tracker](https://convinbackendtask-production.up.railway.app/)

## API Documentation

[API Documentation](https://drive.google.com/file/d/168AGg7SbwQfEI19AHpq4zng4UWsWkWHz/view?usp=sharing)

## Overview

This project is an Express.js application for managing and splitting expenses. It includes features for user authentication, expense tracking, and various methods for splitting expenses.

## Features

- User registration and authentication
- Expense creation with equal, exact, and percentage-based splits
- PDF generation for balance sheets

## Prerequisites

- **Node.js** (v16.x or higher)
- **MongoDB** (Local or MongoDB Atlas)

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YashwanthKumar02/convin_backend_task.git
cd convin_backend_task
```

### 2. Install Dependencies
    
```bash
    npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root directory and add the following environment variables:
    
```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/expense-tracker
    JWT_SECRET
```

### 4. Start the Server
    
```bash
    npm run server
```

## API Endpoints

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login an existing user

- **POST /api/expenses/split** - Create a new expense
- **GET /api/expenses/individual/:id** - Get individual expenses for an expense
- **GET /api/expenses/total/:id** - Get an expense amount by ID
- **GET /api/expenses/balance-sheet/:id** - Generate a balance sheet
- **GET /api/expenses/downloadsheet/:id** - Download a balance sheet
