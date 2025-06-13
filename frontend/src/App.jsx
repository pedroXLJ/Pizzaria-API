import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import pizzaImg from './assets/react.svg'; // Placeholder

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

  return (
    <div className="main-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🍕</span>
          <h1>Gerenciamento de Pizzas</h1>
        </div>
        <div className="user-section">
          {user && (
            <div className="user-info">Olá, {user.name}!</div>
          )}
          {!user && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              👤 Login
            </button>
          )}
          {user && (
            <button className="btn btn-outline" onClick={handleLogout}>
              Sair
            </button>
          )}
        </div>
      </header>

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
              <form onSubmit={handleSubmit}>
                {/* Feedback do CRUD de pizza */}
                {(error || success) && (
                  <div style={{ marginBottom: 8 }}>
                    {error && <div className="alert alert-danger" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 6, padding: 8, marginBottom: 4 }}>{error}</div>}
                    {success && <div className="alert alert-success" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: 8 }}>{success}</div>}
                  </div>
                )}
                <div className="form-group">
                  <label className="label">Nome da Pizza *</label>
                  <input
                    type="text"
                    className="input"
                    name="sabor"
                    value={form.sabor}
                    onChange={handleChange}
                    placeholder="Ex: Margherita"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Ingredientes *</label>
                  <textarea
                    className="textarea"
                    name="ingredientes"
                    value={form.ingredientes}
                    onChange={handleChange}
                    placeholder="Ex: Molho de tomate, mussarela, manjericão"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Atualizar Pizza' : 'Cadastrar Pizza'}
                  </button>
                  {editMode && (
                    <button type="button" className="btn btn-outline" onClick={closePizzaModal}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="empty-state">Faça login para cadastrar ou editar pizzas.</div>
            )}
          </div>
        </div>

        {/* Pizza List Card */}
        <div>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>Pizzas Cadastradas</h2>
          <div className="pizza-list">
            {pizzas.length === 0 && !loading && (
              <div className="card empty-state">Nenhuma pizza cadastrada ainda</div>
            )}
            {pizzas.map(pizza => {
              // Ingredientes pode vir como array de objetos, array de string, string ou null
              let ingredientesStr = '';
              if (Array.isArray(pizza.ingredientes)) {
                // Se for array de objetos, mas está vazio, mostra 'Não informado'
                if (pizza.ingredientes.length === 0) {
                  ingredientesStr = 'Não informado';
                } else if (typeof pizza.ingredientes[0] === 'object' && pizza.ingredientes[0] !== null && 'nome' in pizza.ingredientes[0]) {
                  ingredientesStr = pizza.ingredientes.map(i => i.nome).filter(Boolean).join(', ');
                } else {
                  ingredientesStr = pizza.ingredientes.filter(Boolean).join(', ');
                }
              } else if (typeof pizza.ingredientes === 'string') {
                ingredientesStr = pizza.ingredientes;
              } else {
                ingredientesStr = 'Não informado';
              }
              return (
                <div className={`card pizza-card${editMode && form.id === pizza.id ? ' editing' : ''}`} key={pizza.id}>
                  <div className="card-content">
                    <div className="pizza-header">
                      <div className="pizza-info">
                        <h3>{pizza.sabor}</h3>
                        <span className="badge">{ingredientesStr}</span>
                      </div>
                      {user && (
                        <div className="pizza-actions">
                          <button className="btn btn-sm btn-outline" onClick={() => openPizzaModal(pizza)}>
                            ✏️
                          </button>
                          <button className="btn btn-sm btn-outline" onClick={() => handleDelete(pizza.id)} disabled={deletingId === pizza.id}>
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="pizza-details">
                      <div className="detail-group">
                        <span className="detail-label">Ingredientes:</span>
                        <span className="detail-text">{ingredientesStr}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Modal (Login/Register) */}
      {showModal && (
        <div className="modal-overlay active">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{modalType === 'login' ? 'Login' : 'Criar Conta'}</h3>
              <p className="modal-description">
                {modalType === 'login' ? 'Entre com suas credenciais para acessar o sistema' : 'Preencha os dados para criar sua conta'}
              </p>
            </div>
            {modalType === 'login' ? (
              <form onSubmit={handleLogin}>
                {/* Feedback login */}
                {loginError && <div className="alert alert-danger" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 6, padding: 8, marginBottom: 8 }}>{loginError}</div>}
                <div className="form-group">
                  <label className="label">Usuário</label>
                  <input type="text" className="input" value={loginUser} onChange={e => setLoginUser(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="label">Senha</label>
                  <input type="password" className="input" value={loginPass} onChange={e => setLoginPass(e.target.value)} required />
                </div>
                <div className="form-actions" style={{flexDirection: 'column'}}>
                  <button type="submit" className="btn btn-primary">Entrar</button>
                  <button type="button" className="btn btn-outline" onClick={() => setModalType('register')}>Criar conta</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                {/* Feedback cadastro usuário */}
                {(registerError || registerSuccess) && (
                  <div style={{ marginBottom: 8 }}>
                    {registerError && <div className="alert alert-danger" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 6, padding: 8, marginBottom: 4 }}>{registerError}</div>}
                    {registerSuccess && <div className="alert alert-success" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: 8 }}>{registerSuccess}</div>}
                  </div>
                )}
                <div className="form-group">
                  <label className="label">Usuário</label>
                  <input type="text" className="input" value={registerUser} onChange={e => setRegisterUser(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="label">Senha</label>
                  <input type="password" className="input" value={registerPass} onChange={e => setRegisterPass(e.target.value)} required />
                </div>
                <div className="form-actions" style={{flexDirection: 'column'}}>
                  <button type="submit" className="btn btn-primary">Criar Conta</button>
                  <button type="button" className="btn btn-outline" onClick={() => setModalType('login')}>Já tenho conta</button>
                </div>
              </form>
            )}
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
