import api from './api';

const PedidoService = {
  createPedido: async (clienteId) => {
    const response = await api.post('/pedidos', null, { params: { clienteId } });
    return response.data;
  },

  getPedidoById: async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  getAllPedidos: async () => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  getPedidosByCliente: async (clienteId) => {
    const response = await api.get('/pedidos', { params: { clienteId } });
    return response.data;
  },
};

export default PedidoService;