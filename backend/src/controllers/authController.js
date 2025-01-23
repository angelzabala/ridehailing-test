import { authService } from '../services/authService.js';

export const authController = {
  async register(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.register(email, password);
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}; 