import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define interface for User document
interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  // Add other user properties
}

// Define interface for User model with static methods
interface UserModel extends Model<IUser> {
  findByCredentials(email: string, password: string): Promise<IUser>;
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  // Other fields
});

// Implement the static method
userSchema.statics.findByCredentials = async function(email: string, password: string) {
  const user = await this.findOne({ email });
  
  if (!user) {
    throw new Error('Invalid login credentials');
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    throw new Error('Invalid login credentials');
  }
  
  return user;
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
