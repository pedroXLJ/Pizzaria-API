import React from 'react';

function ClienteForm({ clienteNome, clienteEmail, clienteTelefone, clienteError, clienteSuccess, setClienteNome, setClienteEmail, setClienteTelefone, handleClienteRegister }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">👤 Cadastrar Cliente</h2>
        <p className="card-description">Preencha os dados para cadastrar um novo cliente</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleClienteRegister}>
          {(clienteError || clienteSuccess) && (
            <div style={{ marginBottom: 8 }}>
              {clienteError && <div className="alert alert-danger" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 6, padding: 8, marginBottom: 4 }}>{clienteError}</div>}
              {clienteSuccess && <div className="alert alert-success" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: 8 }}>{clienteSuccess}</div>}
            </div>
          )}
          <div className="form-group">
            <label className="label">Nome *</label>
            <input
              type="text"
              className="input"
              value={clienteNome}
              onChange={e => setClienteNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Email *</label>
            <input
              type="email"
              className="input"
              value={clienteEmail}
              onChange={e => setClienteEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Telefone *</label>
            <input
              type="tel"
              className="input"
              value={clienteTelefone}
              onChange={e => setClienteTelefone(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Cadastrar Cliente</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClienteForm;
