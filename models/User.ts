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
  findByCredentials(email: string, password: string): Promise<IUserDocument | null>;
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
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
  },
  { timestamps: true }
);

// hash password before saving
UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    } catch (error) {
      console.error('Error in password hashing:', error);
      return next(error as Error);
    }
  }
  next();
});

// check if password matches
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error('Error in password check:', error);
    return false;
  }
};

// find user by email and check password
UserSchema.statics.findByCredentials = async function (email: string, password: string) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return null;
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Wrong password for user:', email);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error in finding user:', error);
    return null;
  }
};

export default mongoose.models.User || mongoose.model<IUserDocument, IUserModel>('User', UserSchema);
