# EcoFinds - Sustainable Marketplace

EcoFinds is a modern marketplace platform built with Next.js, focusing on sustainable and eco-friendly products. The platform enables users to buy and sell second-hand items, promoting a circular economy and reducing waste.

## 🌟 Features

- **User Authentication**
  - Secure signup and login
  - JWT-based authentication
  - Protected routes

- **Product Management**
  - Create, read, update, and delete products
  - Product categorization
  - Image upload support
  - Condition-based filtering

- **Shopping Experience**
  - Shopping cart functionality
  - Secure checkout process
  - Purchase history tracking
  - User ratings and reviews

- **Search and Filter**
  - Full-text search
  - Category-based filtering
  - Price range filtering
  - Condition-based filtering

## 🚀 Tech Stack

- **Frontend**
  - Next.js 13+ (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - React Hook Form

- **Backend**
  - Next.js API Routes
  - MongoDB with Mongoose
  - JWT Authentication
  - Bcrypt for password hashing

- **Database**
  - MongoDB Atlas
  - Mongoose ODM

## 📚 Documentation

For detailed documentation, please refer to the following files:

1. [API Documentation](backendapi.md)
   - Complete API endpoints documentation
   - Request/Response formats
   - Authentication requirements
   - Error handling

2. [Database Documentation](db.md)
   - Database schema details
   - Collection structures
   - Relationships
   - Indexes and performance
   - Security measures

3. [Data Models Documentation](readme.md)
   - Model definitions
   - Type interfaces
   - Validation rules
   - Methods and hooks

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone  https://github.com/Darshanroy/odoo-hackathon-178.git
   cd odoo-hackathon-178
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

- `MONGODB_URI`: MongoDB connection string


## 📦 Project Structure

```
ecofinds/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/           # Authentication pages
│   └── (dashboard)/      # Dashboard pages
├── components/            # React components
├── lib/                   # Utility functions
├── models/               # Database models
├── public/               # Static files
└── styles/              # Global styles
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- XSS protection
- CORS configuration

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Live Demo

Visit our live application: [EcoFinds Marketplace](https://odoo-hackathon-178-26ry.vercel.app/)


## 🎥 Demo Features

### Homepage
- Featured sustainable products
- Category-based navigation
- Search functionality
- Responsive design

### Product Showcase
- Vintage Camera ($299.99)
- Organic Cotton T-Shirt ($24.99)
- Bamboo Cutting Board ($39.99)
- Recycled Glass Vase ($45.00)
- Solar Power Bank ($59.99)
- Upcycled Denim Bag ($34.99)

## 👥 Authors

- Manne Rithvik - <mannerithvik708@gmail.com>
- Darshan kumar - Darshankumarr03@gmail.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB team for the database
- All contributors who have helped shape this project

## 📞 Support

For support, email <Darshankumarr03@gmail.com> or <mannerithvik708@gmail.com>

## 🔄 Updates

Stay updated with our latest changes by following our [changelog](CHANGELOG.md). 