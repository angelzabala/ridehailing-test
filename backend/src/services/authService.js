import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

export const authService = {
  async register(email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return { user, token };
  },

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return { user, token };
  }
}; 