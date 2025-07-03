import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import PizzaForm from './components/PizzaForm';
import PizzaList from './components/PizzaList';
import Carrinho from './components/Carrinho';
import ClienteForm from './components/ClienteForm';
import AuthModal from './components/AuthModal';

const API_URL = import.meta.env.VITE_API_URL + '/pizzas';
const AUTH_URL = import.meta.env.VITE_API_URL.replace(/\/pizzas$/, '') + '/auth';

function App() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ id: null, sabor: '', tamanho: '', preco: '', ingredientes: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Token
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  // Atualiza axios para enviar token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      // DEBUG: log para ver como vem os ingredientes
      console.log('PIZZAS API RESPONSE', res.data);
      setPizzas(res.data);
    } catch (err) {
      setError('Erro ao buscar pizzas');
    }
    setLoading(false);
  };

  const openModal = (pizza = null) => {
    if (pizza) {
      setForm({
        id: pizza.id,
        sabor: pizza.sabor,
        tamanho: pizza.tamanho || '',
        preco: pizza.preco || '',
        ingredientes: Array.isArray(pizza.ingredientes)
          ? pizza.ingredientes.map(i => i.nome || i).join(', ')
          : (pizza.ingredientes || '')
      });
      setEditMode(true);
    } else {
      setForm({ id: null, sabor: '', tamanho: '', preco: '', ingredientes: '' });
      setEditMode(false);
    }
    setModalOpen(true);
    setError("");
    setSuccess("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ id: null, sabor: '', tamanho: '', preco: '', ingredientes: '' });
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let ingredientesArr = [];
      if (form.ingredientes.trim() !== "") {
        ingredientesArr = form.ingredientes
          .split(',')
          .map(i => i.trim())
          .filter(i => i.length > 0)
          .map(nome => ({ nome }));
      }
      const payload = {
        sabor: form.sabor,
        tamanho: form.tamanho,
        preco: parseFloat(form.preco),
        ingredientes: ingredientesArr
      };
      if (editMode) {
        await axios.put(`${API_URL}/${form.id}`, payload);
        setSuccess('Pizza atualizada com sucesso!');
      } else {
        await axios.post(API_URL, payload);
        setSuccess('Pizza adicionada com sucesso!');
      }
      fetchPizzas();
      closeModal();
    } catch (err) {
      setError('Erro ao salvar pizza');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Tem certeza que deseja remover esta pizza?')) return;
    setDeletingId(id);
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSuccess('Pizza removida!');
      fetchPizzas();
    } catch (err) {
      setError('Erro ao remover pizza');
    }
    setDeletingId(null);
  };

  // Navegação simples entre páginas (apenas UI)
  const [activePage, setActivePage] = useState('home');
  const handleNav = (page) => {
    setActivePage(page);
  };

  // Handler para navegação do menu
  const handleMenuNav = (page) => {
    setActivePage(page);
  };

  // Login com backend (adaptado para resposta igual ao exemplo do backend)
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await axios.post(`${AUTH_URL}/login`, { username: loginUser, password: loginPass });
      setToken(res.data.token);
      setUser({ name: loginUser });
      setLoginError('');
      localStorage.setItem('token', res.data.token);
      setShowModal(false);
      setLoginSuccess(true);
      setTimeout(() => setLoginSuccess(false), 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setLoginError(err.response.data.error);
      } else {
        setLoginError('Usuário ou senha inválidos');
      }
    }
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setToken('');
    setClienteId(null); // <-- Isso faz o botão reaparecer após logout
    // ...outros resets se necessário...
  };

  // Cadastro
  const [registerUser, setRegisterUser] = useState('');
  const [registerPass, setRegisterPass] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    try {
      await axios.post(`${AUTH_URL}/register`, { username: registerUser, password: registerPass });
      setRegisterSuccess('Usuário cadastrado com sucesso! Faça login.');
      setRegisterError('');
      setRegisterUser('');
      setRegisterPass('');
    } catch (err) {
      setRegisterError('Erro ao cadastrar usuário');
    }
  };

  const [usuarios, setUsuarios] = useState([]);
  const [usuariosLoading, setUsuariosLoading] = useState(false);
  const [usuariosError, setUsuariosError] = useState("");

  // Buscar usuários cadastrados (apenas para admin ou usuário autenticado)
  const fetchUsuarios = async () => {
    setUsuariosLoading(true);
    setUsuariosError("");
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      setUsuariosError('Erro ao buscar usuários');
    }
    setUsuariosLoading(false);
  };

  useEffect(() => {
    if (activePage === 'usuarios') {
      fetchUsuarios();
    }
    // eslint-disable-next-line
  }, [activePage]);

  // Substituir openModal para não conflitar com modal de login/cadastro
  const openPizzaModal = (pizza = null) => {
    if (pizza) {
      // Ingredientes pode ser array de objetos, array de string ou string
      let ingredientesStr = '';
      if (Array.isArray(pizza.ingredientes)) {
        if (pizza.ingredientes.length > 0 && typeof pizza.ingredientes[0] === 'object' && pizza.ingredientes[0] !== null) {
          ingredientesStr = pizza.ingredientes.map(i => i.nome || i).join(', ');
        } else {
          ingredientesStr = pizza.ingredientes.join(', ');
        }
      } else if (typeof pizza.ingredientes === 'string') {
        ingredientesStr = pizza.ingredientes;
      } else {
        ingredientesStr = '';
      }
      setForm({ id: pizza.id, sabor: pizza.sabor, ingredientes: ingredientesStr });
      setEditMode(true);
    } else {
      setForm({ id: null, sabor: '', ingredientes: '' });
      setEditMode(false);
    }
    setModalOpen(true);
    setError("");
    setSuccess("");
  };
  const closePizzaModal = () => {
    setModalOpen(false);
    setForm({ id: null, sabor: '', ingredientes: '' });
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  // Modal helpers
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('login'); // 'login' | 'register'

  const openCustomModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };
  const closeCustomModal = () => setShowModal(false);

  // Cadastro Cliente
  const [clienteNome, setClienteNome] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [clienteError, setClienteError] = useState('');
  const [clienteSuccess, setClienteSuccess] = useState('');
  const [clienteId, setClienteId] = useState(null);

  const handleClienteRegister = async (e) => {
    e.preventDefault();
    setClienteError('');
    setClienteSuccess('');
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/clientes', {
        nome: clienteNome,
        email: clienteEmail,
        telefone: clienteTelefone
      });
      setClienteSuccess('Cliente cadastrado com sucesso!');
      setClienteNome('');
      setClienteEmail('');
      setClienteTelefone('');
      setClienteId(res.data.id); // Salva o ID do cliente cadastrado
    } catch (err) {
      setClienteError('Erro ao cadastrar cliente');
    }
  };

  // Adiciona pizza ao carrinho
  const adicionarAoCarrinho = async (pizza) => {
    if (!clienteId) {
      alert('Cadastre-se como cliente para adicionar ao carrinho!');
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/carrinho`,
        null,
        {
          params: {
            clienteId: clienteId,
            pizzaId: pizza.id,
            quantidade: 1,
            precoUnitario: pizza.preco
          }
        }
      );
      await fetchCarrinho(); // Atualiza o carrinho local após adicionar
      alert('Pizza adicionada ao carrinho!');
    } catch (err) {
      alert('Erro ao adicionar pizza ao carrinho');
    }
  };

  const alterarQuantidade = (id, quantidade) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantidade } : item
      )
    );
  };

  const removerDoCarrinho = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const calcularSubtotal = (item) => item.preco * item.quantidade;
  const totalGeral = cartItems.reduce((acc, item) => acc + calcularSubtotal(item), 0);

  // Exemplo de função para abrir o carrinho
  const handleCartClick = () => setCartOpen(true);

  const onFinalizarPedido = async () => {
    if (!clienteId) {
      alert('Cadastre-se como cliente para finalizar o pedido!');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/pedidos?clienteId=${clienteId}`);
      alert('Pedido realizado com sucesso!');
      setCartItems([]);
    } catch (err) {
      alert('Erro ao finalizar pedido');
    }
  };

  const fetchCarrinho = async () => {
    if (!clienteId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/carrinho`, {
        params: { clienteId }
      });
      console.log('CARRINHO API RESPONSE', res.data); // <-- Adicione este log
      const itens = (res.data || []).map(item => {
        const pizza = pizzas.find(p => p.id === item.pizzaId);
        return {
          id: item.pizzaId,
          sabor: pizza ? pizza.sabor : `Pizza #${item.pizzaId}`,
          preco: item.precoUnitario,
          quantidade: item.quantidade
        };
      });
      setCartItems(itens);
    } catch (err) {
      setCartItems([]);
    }
  };

  const [pedidos, setPedidos] = useState([]);
  const [pedidosLoading, setPedidosLoading] = useState(false);
  const [pedidosError, setPedidosError] = useState('');

  const fetchPedidos = async () => {
    setPedidosLoading(true);
    setPedidosError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/pedidos`);
      setPedidos(res.data);
    } catch (err) {
      setPedidosError('Erro ao buscar pedidos');
    }
    setPedidosLoading(false);
  };

  useEffect(() => {
    if (activePage === 'pedidos' && user) {
      fetchPedidos();
    }
    // eslint-disable-next-line
  }, [activePage, user]);

  return (
    <div className="app-container">
      <Header
        user={user}
        handleLogout={handleLogout}
        setShowModal={setShowModal}
        onCartClick={handleCartClick}
        cartCount={cartItems.length}
        onMenuNav={handleMenuNav}
        activePage={activePage}
      />
      {loginSuccess && (
        <div className="login-success-toast">
          Login realizado com sucesso!
        </div>
      )}
      <main className="main-content">
        {activePage === 'cadastro' && user && (
          <div className="main-grid">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Cadastrar Nova Pizza</h2>
                <p className="card-description">Adicione uma nova pizza ao cardápio</p>
              </div>
              <div className="card-content">
                <PizzaForm
                  form={form}
                  editMode={editMode}
                  error={error}
                  success={success}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  closePizzaModal={closeModal}
                />
              </div>
            </div>
            <div style={{marginTop: '2rem'}}>
              <PizzaList
                pizzas={pizzas}
                loading={loading}
                editMode={editMode}
                form={form}
                user={user}
                openPizzaModal={openPizzaModal}
                handleDelete={handleDelete}
                adicionarAoCarrinho={adicionarAoCarrinho}
                deletingId={deletingId}
              />
            </div>
          </div>
        )}
        {activePage === 'cadastro' && !user && (
          <div className="main-grid">
            <div className="card empty-state" style={{textAlign: 'center', fontSize: '1.2rem', padding: '2rem'}}>
              Faça login para acessar o cadastro de pizzas.
            </div>
          </div>
        )}
        {activePage === 'home' && (
          <div className="main-grid">
            <div className="section-banner">
              <span className="section-title">PIZZAS DA CASA</span>
              <span className="section-logo"><span className="boni">BONI</span><span className="pizza">PIZZA</span></span>
            </div>
            {/* Pizza List Grid ocupa toda a largura */}
            <div className="pizza-list-grid-wrapper">
              <PizzaList
                pizzas={pizzas}
                loading={loading}
                editMode={false}
                form={form}
                user={null}
                openPizzaModal={() => {}}
                handleDelete={null}
                adicionarAoCarrinho={adicionarAoCarrinho}
                deletingId={null}
              />
            </div>
          </div>
        )}
        {activePage === 'pedidos' && user && (
          <div className="main-grid">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Pedidos</h2>
                <p className="card-description">Veja seus pedidos realizados</p>
              </div>
              <div className="card-content">
                {pedidosLoading && <div>Carregando pedidos...</div>}
                {pedidosError && <div style={{color: 'red'}}>{pedidosError}</div>}
                {!pedidosLoading && pedidos.length === 0 && <div>Nenhum pedido encontrado.</div>}
                {!pedidosLoading && pedidos.length > 0 && (
                  <table className="pedidos-table" style={{width: '100%', marginTop: 16}}>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Data</th>
                        <th>Preço Total</th>
                        <th>Itens</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.map(pedido => (
                        <tr key={pedido.id}>
                          <td>{pedido.cliente?.nome || '-'}</td>
                          <td>{pedido.cliente?.email || '-'}</td>
                          <td>{pedido.dataPedido ? new Date(pedido.dataPedido).toLocaleString() : '-'}</td>
                          <td>R$ {pedido.precoTotal?.toFixed(2)}</td>
                          <td>
                            <ul style={{margin: 0, paddingLeft: 16}}>
                              {pedido.itens?.map(item => (
                                <li key={item.id}>
                                  {item.pizza?.sabor || `Pizza #${item.pizzaId}`} - {item.quantidade}x
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
        {activePage === 'pedidos' && !user && (
          <div className="main-grid">
            <div className="card empty-state" style={{textAlign: 'center', fontSize: '1.2rem', padding: '2rem'}}>
              Faça login para acessar os pedidos.
            </div>
          </div>
        )}
        {activePage === 'cadastroCliente' && (
          <div className="main-grid">
            <ClienteForm
              clienteNome={clienteNome}
              clienteEmail={clienteEmail}
              clienteTelefone={clienteTelefone}
              clienteError={clienteError}
              clienteSuccess={clienteSuccess}
              setClienteNome={setClienteNome}
              setClienteEmail={setClienteEmail}
              setClienteTelefone={setClienteTelefone}
              handleClienteRegister={handleClienteRegister}
            />
          </div>
        )}
        {/* Custom Modal (Login/Register) */}
        <AuthModal
          showModal={showModal}
          modalType={modalType}
          setModalType={setModalType}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          loginUser={loginUser}
          setLoginUser={setLoginUser}
          loginPass={loginPass}
          setLoginPass={setLoginPass}
          loginError={loginError}
          registerUser={registerUser}
          setRegisterUser={setRegisterUser}
          registerPass={registerPass}
          setRegisterPass={setRegisterPass}
          registerError={registerError}
          registerSuccess={registerSuccess}
          setShowModal={setShowModal}
        />
      </main>
      {/* Exemplo de modal do carrinho */}
      {cartOpen && (
        <div className="cart-modal-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-modal" onClick={e => e.stopPropagation()}>
            <button className="cart-close-btn" onClick={() => setCartOpen(false)}>&times;</button>
            <Carrinho
              carrinho={cartItems}
              alterarQuantidade={alterarQuantidade}
              removerDoCarrinho={removerDoCarrinho}
              calcularSubtotal={calcularSubtotal}
              totalGeral={totalGeral}
              onFinalizarPedido={onFinalizarPedido}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
