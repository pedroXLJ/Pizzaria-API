import api from './api';

const UserService = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  register: async (user) => {
    const response = await api.post('/auth/register', user);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

export default UserService;