import api from './api';

const PizzaService = {
  getAllPizzas: async () => {
    const response = await api.get('/pizzas');
    return response.data;
  },

  createPizza: async (pizza) => {
    const response = await api.post('/pizzas', pizza);
    return response.data;
  },

  updatePizza: async (id, pizza) => {
    const response = await api.put(`/pizzas/${id}`, pizza);
    return response.data;
  },

  deletePizza: async (id) => {
    await api.delete(`/pizzas/${id}`);
  },
};

export default PizzaService;