# Expense Tracker API

## Overview

This project implements a RESTful API for managing expenses. Users can register, log in, and manage their personal expenses through various endpoints. The application includes authentication and authorization using JWT and supports CRUD operations for expenses with filtering and date-based queries.

## Features

- **User Authentication**:
  - User registration and login.
  - JWT-based authentication.
- **Expense Management**:
  - Create, read, update, and delete expenses.
  - Filter expenses by date range or category.
  - Supported categories: Groceries, Leisure, Electronics, Utilities, Clothing, Health, Others.
- **Pagination and Filtering**:
  - Retrieve expenses with pagination and custom date filters.
- **Error Handling**:
  - Comprehensive error responses for validation, authentication, and other scenarios.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Project Structure

```
expense-tracker-api/
|-- controllers/
|   |-- authController.js
|   |-- expenseController.js
|-- models/
|   |-- userModel.js
|   |-- expenseModel.js
|-- routes/
|   |-- authRoutes.js
|   |-- expenseRoutes.js
|-- middlewares/
|   |-- authMiddleware.js
|-- utils/
|   |-- customError.js
|-- config/
|   |-- db.js
|-- app.js
|-- package.json
```

## Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/07krW5Hnr5ghy/expense-tracker-api
   cd expense-tracker-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and configure the following variables:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/expense_api
   JWT_SECRET=your_secret_key
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3001`.

## API Endpoints

### Authentication Endpoints

#### Register a New User

**POST** `/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "_id": "678c51c79e94f5045863a922",
  "name": "mark",
  "email": "mark@gmail.com",
  "password": "mark123",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGM1MWM3OWU5NGY1MDQ1ODYzYTkyMiIsImlhdCI6MTczNzI1ODMxNCwiZXhwIjoxNzM3MzQ0NzE0fQ.m8eMQpVK-5u0QhjPdozhAOiYprHgxvZvLMFAaKufKBU"
}
```

#### Login

**POST** `/api/auth/login`

```json
{
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "token": "<JWT_TOKEN>"
}
```

### Expense Endpoints

#### Create an Expense

**POST** `/api/expenses`

```json
{
  "title": "Groceries",
  "amount": 100.5,
  "category": "Groceries",
  "date": "2025-01-01T00:00:00Z"
}
```

**Response:**

```json
{
  "id": "<expense_id>",
  "title": "Groceries",
  "amount": 100.5,
  "category": "Groceries",
  "date": "2025-01-01T00:00:00Z"
}
```

#### Get Expenses

**GET** `/api/expenses?page=1&limit=10`
**Response:**

```json
{
  "data": [
    {
      "id": "<expense_id>",
      "title": "Groceries",
      "amount": 100.5,
      "category": "Groceries",
      "date": "2025-01-01T00:00:00Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1
}
```

#### Get Expense by id

**GET** `/api/expenses/:id`
**Response:**

```json
{
  "id": "<expense_id>",
  "title": "Groceries",
  "amount": 100.5,
  "category": "Groceries",
  "date": "2025-01-01T00:00:00Z"
}
```

#### Update an Expense

**PUT** `/api/expenses/<expense_id>`

```json
{
  "title": "Updated Title",
  "amount": 120.75,
  "category": "Utilities",
  "date": "2025-01-02T00:00:00Z"
}
```

**Response:**

```json
{
  "id": "<expense_id>",
  "title": "Updated Title",
  "amount": 120.75,
  "category": "Utilities",
  "date": "2025-01-02T00:00:00Z"
}
```

#### Delete an Expense

**DELETE** `/api/expenses/<expense_id>`
**Response:**

- Status Code: `204 No Content`

### Filters

**GET** `/api/expenses?startDate=2025-01-01&endDate=2025-01-07&timeTerm=custom`
Retrieve expenses within a custom date range.

**GET** `/api/expenses?timeTerm=past_week`
Retrieve expenses within the past week

**GET** `/api/expenses?timeTerm=past_month`
Retrieve expenses within the past month

**GET** `/api/expenses?timeTerm=past_3_months`
Retrieve expenses within the past 3 months.

## Error Handling

- **400 Bad Request**: For validation errors.
- **401 Unauthorized**: For missing/invalid authentication tokens.
- **403 Forbidden**: For access violations.
- **404 Not Found**: For missing resources.

## Future Enhancements

- Add user roles for advanced access control.
- Implement refresh tokens for session management.
- Add support for exporting expenses as CSV/Excel files.

## Project url

https://roadmap.sh/projects/expense-tracker-api
