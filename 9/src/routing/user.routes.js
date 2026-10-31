import { Router } from 'express';
import { userService } from '../business-logic/user.service.js';

const router = Router();

// GET /api/users - Получить всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users - Создать нового пользователя
router.post('/', async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    // Если ошибка валидации (бизнес-логика), возвращаем 400 Bad Request
    res.status(400).json({ error: error.message });
  }
});

export default router;
