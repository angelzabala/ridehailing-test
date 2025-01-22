import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Token no proporcionado');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded.userId });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      throw new Error('Token inválido');
    }
  } catch (error) {
    res.status(401).json({ 
      error: error.message || 'Por favor autentíquese.',
      code: 'UNAUTHORIZED'
    });
  }
}; 
