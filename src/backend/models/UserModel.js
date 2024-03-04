import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  given_name: { type: String, required: true },
  family_name: { type: String, default: '' },
  email: { type: String, required: true },
  picture: { type: String }
});

const User = mongoose.model('User', userSchema);

export default User;