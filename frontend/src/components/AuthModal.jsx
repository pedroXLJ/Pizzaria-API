import React from 'react';

function AuthModal({ showModal, modalType, setModalType, handleLogin, handleRegister, loginUser, setLoginUser, loginPass, setLoginPass, loginError, registerUser, setRegisterUser, registerPass, setRegisterPass, registerError, registerSuccess, setShowModal }) {
  if (!showModal) return null;
  return (
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
  );
}

export default AuthModal;
