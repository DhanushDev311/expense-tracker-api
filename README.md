# Expense Tracker API

A RESTful Expense Tracker API built using **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**.

This project follows the **MVC Architecture** and provides APIs to manage expense categories and transactions.

---

## Features

- RESTful API
- MVC Architecture
- MongoDB Database
- Mongoose ODM
- Expense Categories
- Expense Transactions
- CRUD Operations
- Environment Variable Configuration
- Global Error Handling
- Not Found Middleware

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| dotenv | Environment Variables |

---

## Project Structure

```text
src/
├── config/
│   └── db.js
├── controllers/
│   ├── categoryController.js
│   └── transactionController.js
├── middlewares/
│   ├── errorMiddleware.js
│   └── notFoundMiddleware.js
├── models/
│   ├── Category.js
│   └── Transaction.js
├── routes/
│   ├── categoryRoutes.js
│   └── transactionRoutes.js
├── app.js
└── server.js
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/DhanushDev311/Expense-Tracker-API.git
```

Move into the project

```bash
cd Expense-Tracker-API
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string
```

Start the development server

```bash
npm run dev
```

---

## API Endpoints

### Categories

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/categories | Get all categories |
| GET | /api/categories/:id | Get category by ID |
| POST | /api/categories | Create category |
| PUT | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |

---

### Transactions

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/transactions | Get all transactions |
| GET | /api/transactions/:id | Get transaction by ID |
| POST | /api/transactions | Create transaction |
| PUT | /api/transactions/:id | Update transaction |
| DELETE | /api/transactions/:id | Delete transaction |

---

## Example Transaction

```json
{
  "title": "Electricity Bill",
  "amount": 1200,
  "type": "expense",
  "category": "Utilities",
  "date": "2026-06-13"
}
```

---

## Project Highlights

- Clean MVC Architecture
- RESTful API Design
- MongoDB with Mongoose
- Modular Routing
- Centralized Error Handling
- Scalable Project Structure

---

## Future Improvements

- JWT Authentication
- User Accounts
- Monthly Reports
- Dashboard Analytics
- Budget Tracking
- Pagination
- Filtering
- Search
- Swagger Documentation
- Unit Testing
- Docker Support
- CI/CD Pipeline

---

## Author

**Dhanush Repalle**

GitHub: https://github.com/DhanushDev311

---

## License

MIT License
