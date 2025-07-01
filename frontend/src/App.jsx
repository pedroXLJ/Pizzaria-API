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
  const [form, setForm] = useState({ id: null, sabor: '', ingredientes: '' });
  const [deletingId, setDeletingId] = useState(null);

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
      setForm({ id: pizza.id, sabor: pizza.sabor, ingredientes: pizza.ingredientes });
      setEditMode(true);
    } else {
      setForm({ id: null, sabor: '', ingredientes: '' });
      setEditMode(false);
    }
    setModalOpen(true);
    setError("");
    setSuccess("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ id: null, sabor: '', ingredientes: '' });
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
      // Corrige: se ingredientes for vazio, envia array vazio
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
  const [activePage, setActivePage] = useState('pizza');
  const handleNav = (page) => {
    setActivePage(page);
  };

  // Login com backend (adaptado para resposta igual ao exemplo do backend)
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await axios.post(`${AUTH_URL}/login`, { username: loginUser, password: loginPass });
      // O backend retorna { token: ... } em caso de sucesso
      setToken(res.data.token);
      setUser({ name: loginUser });
      setLoginError('');
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      // O backend retorna { error: ... } em caso de erro
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
    localStorage.removeItem('token');
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

  const handleClienteRegister = async (e) => {
    e.preventDefault();
    setClienteError('');
    setClienteSuccess('');
    try {
      // Ajuste a URL conforme o endpoint do backend para clientes
      await axios.post(import.meta.env.VITE_API_URL + '/clientes', {
        nome: clienteNome,
        email: clienteEmail,
        telefone: clienteTelefone
      });
      setClienteSuccess('Cliente cadastrado com sucesso!');
      setClienteNome('');
      setClienteEmail('');
      setClienteTelefone('');
    } catch (err) {
      setClienteError('Erro ao cadastrar cliente');
    }
  };

  // Carrinho de compras
  const [carrinho, setCarrinho] = useState([]);

  // Adiciona pizza ao carrinho
  const adicionarAoCarrinho = (pizza) => {
    setCarrinho(prev => {
      const existe = prev.find(item => item.id === pizza.id);
      if (existe) {
        return prev.map(item =>
          item.id === pizza.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      } else {
        // Supondo que pizza tenha um campo preco, se não tiver, defina um valor fixo
        return [...prev, { ...pizza, quantidade: 1, preco: pizza.preco || 50 }];
      }
    });
  };

  // Remove pizza do carrinho
  const removerDoCarrinho = (pizzaId) => {
    setCarrinho(prev => prev.filter(item => item.id !== pizzaId));
  };

  // Altera quantidade de uma pizza no carrinho
  const alterarQuantidade = (pizzaId, novaQtd) => {
    if (novaQtd < 1) return;
    setCarrinho(prev => prev.map(item =>
      item.id === pizzaId ? { ...item, quantidade: novaQtd } : item
    ));
  };

  // Calcula subtotal e total
  const calcularSubtotal = (item) => item.preco * item.quantidade;
  const totalGeral = carrinho.reduce((acc, item) => acc + calcularSubtotal(item), 0);

  return (
    <div className="main-container">
      <Header user={user} handleLogout={handleLogout} setShowModal={setShowModal} />
      {/* Main Grid */}
      <div className="main-grid">
        {/* Pizza Form Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              ➕ <span>{editMode ? 'Editar Pizza' : 'Cadastrar Nova Pizza'}</span>
            </h2>
            <p className="card-description">
              {editMode ? 'Modifique os dados da pizza' : 'Adicione uma nova pizza ao cardápio'}
            </p>
          </div>
          <div className="card-content">
            {user ? (
              <PizzaForm
                form={form}
                editMode={editMode}
                error={error}
                success={success}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                closePizzaModal={closePizzaModal}
              />
            ) : (
              <div className="empty-state">Faça login para cadastrar ou editar pizzas.</div>
            )}
          </div>
        </div>
        {/* Formulário de Cadastro de Cliente */}
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
        {/* Pizza List Card */}
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
        {/* Carrinho de Compras */}
        <Carrinho
          carrinho={carrinho}
          alterarQuantidade={alterarQuantidade}
          removerDoCarrinho={removerDoCarrinho}
          calcularSubtotal={calcularSubtotal}
          totalGeral={totalGeral}
        />
      </div>
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
    </div>
  );
}

export default App;
