# EcoFinds Data Models Documentation

## User Model

The User model represents user accounts in the system.

### Schema
```typescript
interface IUser {
  email: string;
  password: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Fields
- `email` (String, required)
  - Must be a valid email format
  - Must be unique
  - Automatically converted to lowercase
  - Trimmed of whitespace

- `password` (String, required)
  - Minimum length: 6 characters
  - Automatically hashed before saving using bcrypt

- `username` (String, required)
  - Minimum length: 3 characters
  - Trimmed of whitespace

### Methods
- `comparePassword(password: string): Promise<boolean>`
  - Compares provided password with hashed password
  - Returns true if passwords match

### Static Methods
- `findByCredentials(email: string, password: string): Promise<IUserDocument | null>`
  - Finds user by email and verifies password
  - Returns user document if credentials are valid

## Product Model

The Product model represents items listed for sale.

### Schema
```typescript
interface IProduct {
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  condition?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Fields
- `title` (String, required)
  - Trimmed of whitespace

- `description` (String, required)
  - Trimmed of whitespace

- `price` (Number, required)
  - Must be a positive number
  - Minimum value: 0

- `image` (String, optional)
  - URL to product image

- `category` (String, optional)
  - Trimmed of whitespace

- `condition` (String, optional)
  - Enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  - Default: 'Good'

- `userId` (String, required)
  - Reference to the seller's user ID
  - Indexed for faster queries

## Purchase Model

The Purchase model represents completed transactions.

### Schema
```typescript
interface IPurchase {
  productId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

### Fields
- `productId` (ObjectId, required)
  - Reference to the purchased product
  - Ref: 'Product'

- `buyerId` (ObjectId, required)
  - Reference to the buyer's user ID
  - Ref: 'User'

- `sellerId` (ObjectId, required)
  - Reference to the seller's user ID
  - Ref: 'User'

- `status` (String, required)
  - Enum: ['pending', 'completed', 'cancelled']
  - Default: 'pending'

### Timestamps
All models include automatic timestamp fields:
- `createdAt`: Set when the document is created
- `updatedAt`: Updated whenever the document is modified

## Database Connection

The application uses MongoDB as its database, with the following configuration:

- Connection URI: Set via `MONGODB_URI` environment variable
- Connection is cached for better performance
- Automatic reconnection handling
- Buffer commands disabled for better performance

## Type Definitions

### Cart Item Type
```typescript
interface CartItem {
  productId: string;
  quantity: number;
}
```

### Product Type (Frontend)
```typescript
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  condition?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are generated during login/signup
- Token expiration: 7 days
- Token payload includes user ID
- Tokens are verified on protected routes 