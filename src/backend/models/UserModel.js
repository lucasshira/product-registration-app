import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  given_name: { type: String, required: true },
  family_name: { type: String, required: true },
  email: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default User;