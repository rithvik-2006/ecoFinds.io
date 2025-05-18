import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  email: string;
  password: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  findByCredentials(email: string, password: string): Promise<IUserDocument>;
}

export interface IUserDocument extends IUser, mongoose.Document {
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUserDocument, IUserModel>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      trim: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    try {
      user.password = await bcrypt.hash(user.password, 10);
    } catch (error) {
      console.error('Error hashing password:', error);
      return next(error as Error);
    }
  }
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Static method to find user by credentials
UserSchema.statics.findByCredentials = async function (email: string, password: string) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      throw new Error('Invalid login credentials');
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      throw new Error('Invalid login credentials');
    }
    
    return user;
  } catch (error) {
    console.error('Error in findByCredentials:', error);
    throw error;
  }
};

export default mongoose.models.User || mongoose.model<IUserDocument, IUserModel>('User', UserSchema);
