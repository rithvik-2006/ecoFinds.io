# EcoFinds Database Documentation

## Database Overview
The application uses MongoDB as its database system, with Mongoose as the ODM (Object Document Mapper). The database is hosted on MongoDB Atlas.

## Collections (Tables)

### 1. Users Collection
```typescript
Collection Name: users

Schema: {
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}

Indexes:
- email: unique index
- username: text index

Pre-save Hooks:
- Password hashing using bcrypt
```

### 2. Products Collection
```typescript
Collection Name: products

Schema: {
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    optional: true
  },
  category: {
    type: String,
    optional: true,
    trim: true
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}

Indexes:
- userId: index
- title: text index
- description: text index
- category: index
```

### 3. Purchases Collection
```typescript
Collection Name: purchases

Schema: {
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}

Indexes:
- productId: index
- buyerId: index
- sellerId: index
- status: index

Pre-save Hooks:
- Update updatedAt timestamp
```

## Relationships

### User-Product Relationship
- One-to-Many relationship
- A user can have multiple products (as seller)
- Each product belongs to one user (seller)
- Referenced through `userId` field in products collection

### User-Purchase Relationship
- One-to-Many relationship
- A user can have multiple purchases (as buyer)
- A user can have multiple sales (as seller)
- Referenced through `buyerId` and `sellerId` fields in purchases collection

### Product-Purchase Relationship
- One-to-Many relationship
- A product can be purchased multiple times
- Each purchase references one product
- Referenced through `productId` field in purchases collection

## Database Configuration

### Connection Settings
```typescript
const MONGODB_URI = process.env.MONGODB_URI;

Connection Options: {
  bufferCommands: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
}
```

### Connection Management
- Connection is cached for better performance
- Automatic reconnection handling
- Connection pooling enabled
- Error handling and logging

## Data Validation

### User Data Validation
- Email format validation
- Password minimum length: 6 characters
- Username minimum length: 3 characters
- Unique email constraint
- Password hashing before save

### Product Data Validation
- Required fields: title, description, price, userId
- Price must be positive number
- Condition must be one of predefined values
- Category and image are optional

### Purchase Data Validation
- Required fields: productId, buyerId, sellerId
- Status must be one of predefined values
- All IDs must be valid ObjectIds
- Automatic timestamp updates

## Indexes and Performance

### Text Search Indexes
- Products: title and description fields
- Users: username field

### Regular Indexes
- Products: userId, category
- Purchases: productId, buyerId, sellerId, status
- Users: email (unique)

## Security Measures

### Password Security
- Passwords are hashed using bcrypt
- Salt rounds: 10
- Pre-save hook for automatic hashing

### Data Access Control
- JWT-based authentication
- Token expiration: 7 days
- Protected routes require valid token
- User can only access their own data

## Backup and Recovery

### Backup Strategy
- MongoDB Atlas automated backups
- Daily snapshots
- Point-in-time recovery available

### Recovery Options
- Restore from snapshot
- Point-in-time recovery
- Manual export/import available 