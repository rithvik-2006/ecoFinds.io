# EcoFinds API Documentation

## Authentication Endpoints

### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "username": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "username": "string"
  },
  "token": "string"
}
```

**Validation:**
- Email must be valid format
- Password must be at least 6 characters
- Username must be at least 3 characters
- Email must be unique

### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "username": "string"
  },
  "token": "string"
}
```

## Product Endpoints

### GET /api/products
Get all products with optional filtering and pagination.

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in product titles and descriptions
- `userId` (optional): Filter by seller
- `limit` (optional, default: 10): Number of items per page
- `page` (optional, default: 1): Page number

**Response:**
```json
{
  "products": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "price": "number",
      "category": "string",
      "userId": "string",
      "createdAt": "string"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "pages": "number"
  }
}
```

### GET /api/products/[id]
Get a specific product by ID.

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "userId": "string",
  "createdAt": "string"
}
```

### POST /api/products
Create a new product (requires authentication).

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "category": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "userId": "string",
  "createdAt": "string"
}
```

### DELETE /api/products/[id]
Delete a product (requires authentication).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

### GET /api/products/my-listings
Get all products listed by the authenticated user.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "price": "number",
    "category": "string",
    "userId": "string",
    "createdAt": "string"
  }
]
```

## Cart Endpoints

### GET /api/cart
Get user's cart (requires authentication).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "cartItems": []
}
```

### POST /api/cart
Update user's cart (requires authentication).

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "cartItems": []
}
```

**Response:**
```json
{
  "cartItems": []
}
```

## Checkout Endpoint

### POST /api/checkout
Process checkout and create order (requires authentication).

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "cartItems": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "orderId": "string"
}
```

## Purchases Endpoint

### GET /api/purchases
Get user's purchase history (requires authentication).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "purchases": []
}
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is obtained during login or signup and is valid for 7 days.

## Error Responses

All endpoints may return the following error responses:

**401 Unauthorized:**
```json
{
  "message": "Unauthorized"
}
```

**400 Bad Request:**
```json
{
  "message": "Error message"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Error message"
}
``` 