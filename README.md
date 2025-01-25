# Product Management System

A simple product management system built with **NestJS**, **TypeORM**, and **MySQL**. This system provides authentication and role-based access control, allowing **admins** to manage products and **users** to browse and query them.

---

## Features

### Authentication
- **Register**: Create a new user account.
- **Login**: Authenticate and retrieve a JWT token.

### User
- **Get Profile**: Retrieve the profile of the authenticated user.

### Product Management
- **Create Product**: Admins only.
- **Update Product**: Admins only.
- **Delete Product**: Admins only.
- **Get One Product**: Accessible to any authenticated user.
- **Get All Products by Query**: Accessible to any authenticated user, with filtering and pagination options:
  - `page`
  - `perPage`
  - `name`
  - `minPrice`, `maxPrice`
  - `minStock`, `maxStock`

---

## Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root and configure the keys at the `.env.examples` file:
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USER=root
   DATABASE_PASSWORD=yourpassword
   DATABASE_NAME=product_management
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
4. Create database with the same of **DATABASE_NAME** on the `.env` file
5. Run database migrations:
   ```bash
   npm run migrate
   ```
6. Start the application:
   ```bash
   npm run start:dev
   ```
7. Run tests :
   ```bash
   npm test
   ```

---

## API Documentation

### Authentication Endpoints

#### Register
- **POST** `/auth/register`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "role": "user"
  }
  ```

#### Login
- **POST** `/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

---

### User Endpoints

#### Get Profile
- **GET** `/users/profile`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```

---

### Product Endpoints

#### Create Product (Admins only)
- **POST** `/products`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```
- **Request Body**:
  ```json
  {
    "name": "Product Name",
    "price": 100,
    "stock": 10,
    "description": "Product Description"
  }
  ```

#### Update Product (Admins only)
- **PUT** `/products/:id`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "price": 120,
    "stock": 15,
    "description": "Updated Description"
  }
  ```

#### Delete Product (Admins only)
- **DELETE** `/products/:id`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```

#### Get One Product
- **GET** `/products/:id`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```

#### Get All Products by Query
- **GET** `/products`
- **Query Parameters**:
  - `page` (default: 1)
  - `perPage` (default: 10)
  - `name` (filter by product name)
  - `minPrice`, `maxPrice` (filter by price range)
  - `minStock`, `maxStock` (filter by stock range)
- **Headers**:
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```

---

## Role-Based Access Control

- **Admin**:
  - Manage products (create, update, delete).
  - View all products.
  - View their profile.
- **User**:
  - View their profile.
  - View all products.
