import { userRepository } from '../data-access/user.repository.js';

export const userService = {
  async getUsers() {
    // Здесь может быть дополнительная фильтрация, маппинг или кэширование
    return await userRepository.getAll();
  },

  async createUser(userData) {
    // Валидация бизнес-правил
    if (!userData.name || !userData.email) {
      throw new Error('Имя и Email обязательны для заполнения');
    }
    
    if (!userData.email.includes('@')) {
      throw new Error('Некорректный формат Email');
    }

    return await userRepository.add(userData);
  }
};
